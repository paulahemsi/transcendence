import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('images')
export class ImagesController {
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename(_, file, callback) {
          return callback(null, `${file.originalname}`);
        },
      }),
    }),
  )
  uploadImage(@UploadedFile() file: any) {
    return { url: `http://localhost:3000/images/${file.filename}` };
  }
}
