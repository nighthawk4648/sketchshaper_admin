import fse from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
// import { dirname } from 'path';

const filename = fileURLToPath(import.meta.url);
const topDir = path.dirname(filename);

fse.emptyDirSync(path.join(topDir, 'public', 'tinymce'));
fse.copySync(path.join(topDir, 'node_modules', 'tinymce'), path.join(topDir, 'public', 'tinymce'), { overwrite: true });