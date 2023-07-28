import React, {useState} from 'react';
import {useQueryClient} from 'react-query';
import axios from 'axios';
import {notification, Button} from 'antd';

export const Loader: React.FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const queryClient = useQueryClient();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(filesArray);
        }
    };

    const handleUpload = async () => {
        const token = 'y0_AgAAAABotSUSAAo-TgAAAADow-bQtWXiH1k0RMuNr4d9i0yNuQGGyPU';
        const uploadFolder = 'folder';

        const getUploadUrl = async (file: File) => {
            try {
                const response = await axios.get(
                    `https://cloud-api.yandex.net/v1/disk/resources/upload?path=/${encodeURIComponent(
                        uploadFolder
                    )}/${encodeURIComponent(file.name)}&overwrite=true`,
                    {
                        headers: {
                            Authorization: `OAuth ${token}`,
                        },
                    }
                );
                return response.data.href;
            } catch (error) {
                throw new Error(`Ошибка при получении URL для загрузки файла ${file.name}`);
            }
        };

        const uploadFile = async (file: File) => {
            const uploadUrl = await getUploadUrl(file);
            try {
                await axios.put(uploadUrl, file, {
                    headers: {
                        'Content-Type': file.type,
                    },
                });

                notification.success({
                    message: `Файл ${file.name} успешно загружен`,
                });
            } catch (error) {
                notification.error({
                    message: `Ошибка при загрузке файла ${file.name}`,
                });
            }
        };

        if (selectedFiles.length > 0) {
            for (const file of selectedFiles) {
                await uploadFile(file);
            }
            await queryClient.invalidateQueries('uploadedFiles');
        }
    };

    return (
        <div>
            <h2>Выберите файлы для загрузки</h2>
            <input type="file" multiple onChange={handleFileChange}/>
            <Button type="primary" onClick={handleUpload}>
                Загрузить
            </Button>
        </div>
    );
};
