"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const uploadPlaceholder_1 = __importStar(require("../lib/uploadPlaceholder"));
const types_1 = require("../types");
const insertFiles = function (view, event, pos, files, options) {
    const images = files.filter(file => /image/i.test(file.type));
    if (images.length === 0)
        return;
    const { dictionary, uploadImage, onImageUploadStart, onImageUploadStop, onShowToast, } = options;
    if (!uploadImage) {
        console.warn("uploadImage callback must be defined to handle image uploads.");
        return;
    }
    event.preventDefault();
    if (onImageUploadStart)
        onImageUploadStart();
    const { schema } = view.state;
    let complete = 0;
    for (const file of images) {
        const id = {};
        const { tr } = view.state;
        tr.setMeta(uploadPlaceholder_1.default, {
            add: { id, file, pos },
        });
        view.dispatch(tr);
        uploadImage(file)
            .then(src => {
            const pos = uploadPlaceholder_1.findPlaceholder(view.state, id);
            if (pos === null)
                return;
            const transaction = view.state.tr
                .replaceWith(pos, pos, schema.nodes.image.create({ src }))
                .setMeta(uploadPlaceholder_1.default, { remove: { id } });
            view.dispatch(transaction);
        })
            .catch(error => {
            console.error(error);
            const transaction = view.state.tr.setMeta(uploadPlaceholder_1.default, {
                remove: { id },
            });
            view.dispatch(transaction);
            if (onShowToast) {
                onShowToast(dictionary.imageUploadError, types_1.ToastType.Error);
            }
        })
            .finally(() => {
            complete++;
            if (complete === images.length) {
                if (onImageUploadStop)
                    onImageUploadStop();
            }
        });
    }
};
exports.default = insertFiles;
//# sourceMappingURL=insertFiles.js.map