import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Define __dirname manually for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// --- CORRECCIÓN 1: USAR LA SERVICE ROLE KEY ---
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
// Busca esta variable en tu .env. Si no la tienes, agrégala o pégala aquí directamente entre comillas.
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Error: Falta SUPABASE_SERVICE_ROLE_KEY en el archivo .env');
    console.error('Ve a Supabase > Settings > API, copia la key "service_role" y agrégala a tu .env');
    process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const LOCAL_IMAGES_PATH = String.raw`C:\Users\magic\OneDrive\Imágenes\Catalogo\editadas`;
const JSON_PATH = path.join(__dirname, 'catalog.json');

// --- CORRECCIÓN 2: FUNCIÓN PARA LIMPIAR NOMBRES DE ARCHIVO ---
function sanitizeFilename(filename: string): string {
    return filename
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quitar acentos (á -> a)
        .replace(/\s+/g, '_')          // Espacios -> guiones bajos
        .replace(/[()]/g, '')          // Quitar paréntesis
        .toLowerCase();                // Todo minúsculas
}

interface ProductData {
    reference_filename: string;
    name: string;
    description: string;
    category: string;
    material: string;
    price: number;
    original_price: number;
    stock: number;
    badge: string | null;
    rating: number;
    new_collection: boolean;
    sold_quantity: number;
}

async function uploadCatalog() {
    try {
        if (!fs.existsSync(JSON_PATH)) {
            console.error(`❌ No encuentro el archivo JSON en: ${JSON_PATH}`);
            return;
        }

        const rawData = fs.readFileSync(JSON_PATH, 'utf-8');
        const products: ProductData[] = JSON.parse(rawData);

        console.log(`🚀 Iniciando carga maestra de ${products.length} productos...`);

        for (const product of products) {
            console.log(`\n📦 Procesando: ${product.name}`);

            const localFilePath = path.join(LOCAL_IMAGES_PATH, product.reference_filename);

            if (!fs.existsSync(localFilePath)) {
                console.warn(`  ⚠️  Imagen no encontrada en disco: ${localFilePath}`);
                continue;
            }

            const fileBuffer = fs.readFileSync(localFilePath);
            const mimeType = mime.lookup(localFilePath) || 'application/octet-stream';

            // Usamos la función de limpieza para el nombre en la nube
            const cleanFileName = sanitizeFilename(product.reference_filename);
            const storagePath = `catalog_2026/${cleanFileName}`;

            // 1. Subir a Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('products')
                .upload(storagePath, fileBuffer, {
                    contentType: mimeType,
                    upsert: true
                });

            if (uploadError) {
                console.error(`  ❌ Error subiendo imagen: ${uploadError.message}`);
                continue;
            }

            // 2. Obtener URL Pública
            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(storagePath);

            console.log(`  ✅ Imagen subida: .../${cleanFileName}`);

            // 3. Preparar datos para DB
            const { reference_filename, ...dbRecord } = product;

            const productPayload = {
                ...dbRecord,
                image: publicUrl
            };

            // 4. Insertar en Base de Datos
            const { error: insertError } = await supabase
                .from('products')
                .insert([productPayload]);

            if (insertError) {
                console.error(`  ❌ Error insertando en BD: ${insertError.message}`);
            } else {
                console.log(`  🎉 Producto guardado correctamente.`);
            }
        }

        console.log('\n🏁 --- PROCESO TERMINADO --- 🏁');

    } catch (error) {
        console.error('Error fatal:', error);
    }
}

uploadCatalog();