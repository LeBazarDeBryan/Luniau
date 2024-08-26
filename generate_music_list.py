import os
import json

def list_files(startpath):
    file_list = []
    for root, dirs, files in os.walk(startpath):
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                file_list.append({
                    'name': file,
                    'path': os.path.relpath(os.path.join(root, file), startpath)
                })
    return file_list

start_directory = '.'
extensions = ['.wav', '.flac']
files = list_files(start_directory, extensions)

with open('music.json', 'w') as f:
    json.dump(files, f, indent=4)

print('Liste de musique (JSON) généré avec succès!')
