import os

def list_files(start_directory, extensions):
    matching_files = []
    
    for root, dirs, files in os.walk(start_directory):
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                matching_files.append(os.path.join(root, file))
    
    return matching_files

start_directory = '/path/to/your/directory'
extensions = ['.wav', '.flac']

files = list_files(start_directory, extensions)
print(files)
