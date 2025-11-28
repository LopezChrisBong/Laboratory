import { join } from 'path';

export class Helper {
  static customFileName(req, file, cb) {
    let customFile = file.originalname.split('.')[0];
    customFile =
      customFile.replace(/\s/g, "").replace(/%20/g, "") + Date.now() + '-' + Math.round(Math.random() * 1e9);
    let fileExtension = '';

        if (file.mimetype.indexOf('jpeg') > -1) {
        fileExtension = '.jpeg';
      } else if (file.mimetype.indexOf('jpg') > -1) {
        fileExtension = '.jpg';
      } else if (file.mimetype.indexOf('png') > -1) {
        fileExtension = '.png';
      } else if (file.mimetype.indexOf('pdf') > -1) {
        fileExtension = '.pdf';
      } else if (file.mimetype.indexOf('ms-excel') > -1) {
        fileExtension = '.xls';
      } else if (
        file.mimetype.indexOf(
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ) > -1
      ) {
        fileExtension = '.xlsx';
      }


    customFile = customFile + fileExtension;
    cb(null, customFile);
  }

  static filePath(req, file, cb) {
    cb(null, join(process.cwd(), '/../upload_img/'));
  }

  static student_files(req, file, cb) {
    cb(null, join(process.cwd(), '/../student_file/'));
    // cb(null, join(process.cwd(), '/student_file/'));

  }

    static lab_result_attachment(req, file, cb) {
    // cb(null, join(process.cwd(), '/lab_result_attachment/'));
    cb(null, join(process.cwd(), '/../lab_result_attachment/'));
}

  // static esign_filepath(req, file, cb) {
  //   cb(null, join(process.cwd(), '/../uploadedEsigImg/'));
  // }
}
