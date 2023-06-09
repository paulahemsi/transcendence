import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

@Controller('images')
export class ImagesController {
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (request, file, callback) => {
          const user = request.user;
          const path = `./uploads/${user}`;
          fs.mkdirSync(path, { recursive: true });
          callback(null, path);
        },
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
    @Req() request: Request,
  ) {
    const userId = request.user;
    return {
      url: process.env.BACK_HOST + `/images/${userId}/${file.filename}`,
    };
  }

  @Get(':id/:path')
  getImage(
    @Param('id') id: ParseUUIDPipe,
    @Param('path') path: string,
    @Res() response: Response,
  ) {
    response.sendFile(path, { root: `uploads/${id}` });
  }
}
