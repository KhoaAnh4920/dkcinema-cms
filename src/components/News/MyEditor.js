import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const API_URL = "http://localhost:8000";
const UPLOAD_ENDPOINT = "upload_files";

export default function MyEditor({ handleChangeCKEdittor, ...props }) {



    function uploadAdapter(loader) {
        return {
            upload: () => {
                return new Promise((resolve, reject) => {
                    const body = new FormData();
                    loader.file.then((file) => {
                        body.append("files", file);
                        // let headers = new Headers();
                        // headers.append("Origin", "http://localhost:3000");
                        fetch(`${API_URL}/${UPLOAD_ENDPOINT}`, {
                            method: "post",
                            body: body,
                            mode: "no-cors"
                        })
                            .then((res) => res.json())
                            .then((res) => {
                                resolve({
                                    default: `${API_URL}/${res.filename}`
                                });
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    });
                });
            }
        };
    }
    function uploadPlugin(editor) {
        editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
            return uploadAdapter(loader);
        };
    }
    return (
        <div className="App">
            <CKEditor
                data={(props.defaultValue) ? props.defaultValue : ''}
                config={{
                    // extraPlugins: [uploadPlugin]
                    ckfinder: {
                        uploadUrl: `${API_URL}/${UPLOAD_ENDPOINT}`
                    }
                }}
                editor={ClassicEditor}
                onReady={(editor) => { }}
                onBlur={(event, editor) => { }}
                onFocus={(event, editor) => { }}
                onChange={(event, editor) => {
                    handleChangeCKEdittor(editor.getData());
                }}
                {...props}
            />
        </div>
    );
}

