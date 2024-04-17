// import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { FilmModel } from "../models/film.model.js";

cloudinary.config({
    cloud_name: 'dh0lhvm9l',
    api_key: '314188383667441',
    api_secret: 'g_PBWzOuyUVbjMZymyMR8BjwfZE'
});


// Endpoint API để upload hình ảnh và cập nhật vào phim
const uploadImageAndUpdateFilm = async (req, res) => {
    try {
        // Kiểm tra xem có file hình ảnh được gửi từ client không
        if (!req.file) {
            return res.status(400).json({ error: 'Vui lòng chọn một tập tin hình ảnh' });
        }

        // Lấy thông tin về file hình ảnh từ req.file
        const file = req.file;
        const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        // Upload hình ảnh lên Cloudinary và nhận lại URL của hình ảnh đã tải lên
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(dataUrl, {
                // Cấu hình Cloudinary (nếu cần)
            }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        // Lấy URL của hình ảnh đã tải lên từ kết quả của Cloudinary
        const imageUrl = result.secure_url;
        // Lấy ID của phim cần cập nhật từ req.params hoặc req.body 
        const filmId = req.params.filmId;

        // Cập nhật URL hình ảnh vào phim tương ứng trong cơ sở dữ liệu
        const updatedFilm = await FilmModel.findByIdAndUpdate(filmId, { image: imageUrl }, { new: true });
        if (!updatedFilm) {
            res.status(403).json({
                msg: "sai roi"
            })
        }
        // Trả về kết quả cập nhật
        res.status(200).json({ msg: 'Hình ảnh đã được tải lên và cập nhật thành công', film: updatedFilm });
    } catch (error) {
        res.status(400).json({ msg: 'Đã xảy ra lỗi khi tải lên và cập nhật hình ảnh', error });
    }
};

export default uploadImageAndUpdateFilm
