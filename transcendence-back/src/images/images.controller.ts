import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';

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
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: '(jpeg|jpg|png)$' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return { url: `http://localhost:4444/images/${file.filename}` };
  }

  @Get(':path')
  getImage(@Param('path') path: string, @Res() response: Response) {
    response.sendFile(path, { root: 'uploads' });
  }
}
