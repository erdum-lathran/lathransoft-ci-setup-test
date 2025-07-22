import _, { get } from 'lodash';
import Util from './Util';
import ENVConfig from '../configs/ENVConfig';
import { FormatTypes } from '../static/Constants';
import {
  DocsSVG,
  ExcelIconSVG,
  FolderIconSVG,
  ImageIconSVG,
  LinkIconSVG,
  Mp3IconSVG,
  PDFIconSVG,
  PPTIconSVG,
  TxtIconSVG,
  VideoIconSVG,
  WordIconSVG,
  XMLIconSVG,
  HtmlIconSVG,
  IPAIconSVG,
  APKIconSVG,
  ArchiveIconSVG,
  SVGIcon,
} from '../static/svgs';

class DocumentUtil {
  id = document => get(document, 'id', null);

  tenantId = document => get(document, 'tenantId', null);

  userId = document => get(document, 'userId', null);

  name = document => get(document, 'name', '');

  ownerEmail = document => get(document, 'ownerEmail', '');

  key = document => get(document, 'key', '');

  parentId = document => get(document, 'parentId', null);

  itemCount = document =>
    `${get(document, 'itemCount', 0)} ${get(document, 'itemCount', 0) > 1 ? 'Items' : 'Item'}`;

  format = document => get(document, 'format', '');

  url = document => Util.makeURLValid(get(document, 'url', null));

  size = document => Util.formatFileSize(get(document, 'size', null));

  readableSize = document => get(document, 'readableSize', null);

  type = document => get(document, 'type', null);

  isDeleted = document => get(document, 'isDeleted', false);

  isPrivate = document => get(document, 'isPrivate', false);

  isPublic = document => get(document, 'isPublic', false);

  deletedAt = document => {
    const dateTime = get(document, 'deletedAt', null);
    const localDateTime = dateTime ? Util.localTZDateTime(dateTime) : '';
    return localDateTime;
  };

  createdAt = document => {
    const dateTime = get(document, 'createdAt', null);
    const localDateTime = dateTime ? Util.localTZDateTime(dateTime) : '';
    return localDateTime;
  };

  updatedAt = document => {
    // const dateTime = get(document, 'updatedAt', null);
    const location = window.location.pathname;
    console.log(location, 'location');
    const isArchivePage = location.includes('archive');
    const isFavoritePage = location.includes('favourites');

    const dateTime =
      isArchivePage && document.archivedAt
        ? document.archivedAt
        : isFavoritePage && document.favoritesAt
          ? document.favoritesAt
          : document.updatedAt;

    const localDateTime = dateTime ? Util.localTZDateTime(dateTime) : '';
    return localDateTime;
  };

  isFavorite = document => get(document, 'isFavorite', false);

  isArchive = document => get(document, 'isArchived', false);

  // Custom Fnctions

  isExpanded = document => get(document, 'isExpanded', false);

  isFolder = document => this.type(document) == FormatTypes.Folder;

  isLink = document => this.type(document) == FormatTypes.Link;

  s3Path = doc => (doc ? ENVConfig.S3Path + doc : '');

  customSize = document =>
    this.type(document) == FormatTypes.Link
      ? ''
      : this.isFolder(document)
        ? this.itemCount(document)
        : this.readableSize(document);

  getFileName = name => {
    const fileName = name;
    if (fileName) {
      let splitedFilename = fileName.split('.');
      const lastIndexValue = splitedFilename[splitedFilename.length - 1];
      return lastIndexValue ?? fileName;
    } else {
      return '';
    }
  };

  icon = (document, addClass, byName = false) => {
    if (this.isFolder(document)) {
      return <FolderIconSVG className={addClass} />;
    }

    if (this.isLink(document)) {
      return <LinkIconSVG className={addClass} />;
    }

    const title = byName ? this.name(document) : this.format(document);
    if (title) {
      switch (true) {
        case title.endsWith('doc'):
        case title.endsWith('docs'):
        case title.endsWith('docx'):
          return <WordIconSVG />;

        case title.endsWith('xlsx'):
        case title.endsWith('xls'):
          return <ExcelIconSVG />;

        case title.endsWith('txt'):
        case title.endsWith('text'):
          return <TxtIconSVG />;

        case title.endsWith('html'):
          return <HtmlIconSVG />;

        case title.endsWith('svg'):
          return <SVGIcon />;

        case title.endsWith('pdf'):
          return <PDFIconSVG />;

        case _.get(document, 'type', '') == FormatTypes.Images:
        case title.endsWith('png'):
        case title.endsWith('jpg'):
        case title.endsWith('jpeg'):
        case title.endsWith('image'):
          // return (
          //   <img
          //     className={addClass ? addClass : `doc-icon`}
          //     src={document}
          //     onError={() => <ImageIconSVG />}
          //   />
          // );
          return <ImageIconSVG />;
        case _.get(document, 'type', '') == FormatTypes.Videos:
        case title.endsWith('mov'):
        case title.endsWith('mp4'):
          return <VideoIconSVG />;

        case _.get(document, 'type', '') == 'audio':
        case title.endsWith('mp3'):
          return <Mp3IconSVG />;

        case title.endsWith('folder'):
          return <FolderIconSVG />;

        case _.get(document, 'type', '') == FormatTypes.Link:
        case title.endsWith('link'):
          return <LinkIconSVG />;

        case title.endsWith('zip'):
          return <ArchiveIconSVG />;

        case title.endsWith('xml'):
          return <XMLIconSVG />;

        case title.endsWith('ipa'):
          return <IPAIconSVG />;

        case title.endsWith('apk'):
          return <APKIconSVG />;

        case title.endsWith('ppt'):
        case title.endsWith('pptx'):
          return <PPTIconSVG />;
        default:
          return <DocsSVG />;
      }
    }
  };

  // icon = (document, addClass) => {
  //   if (this.isFolder(document)) {
  //     return <FolderIconSVG className={addClass} />;
  //   }

  //   const name = this.name(document);

  //   switch (true) {
  //     case this.getFileName(name).endsWith('doc'):
  //     case this.getFileName(name).endsWith('docs'):
  //     case this.getFileName(name).endsWith('docx'):
  //       return <WordIconSVG />;

  //     case this.getFileName(name).endsWith('xlsx'):
  //     case this.getFileName(name).endsWith('xls'):
  //       return <ExcelIconSVG />;

  //     case this.getFileName(name).endsWith('txt'):
  //     case this.getFileName(name).endsWith('text'):
  //       return <TxtIconSVG />;

  //     case this.getFileName(name).endsWith('html'):
  //       return <HtmlIconSVG />;

  //     case this.getFileName(name).endsWith('pdf'):
  //       return <PDFIconSVG />;

  //     case _.get(document, 'type', '') == FormatTypes.Images:
  //     case this.getFileName(name).endsWith('png'):
  //     case this.getFileName(name).endsWith('jpg'):
  //     case this.getFileName(name).endsWith('jpeg'):
  //     case this.getFileName(name).endsWith('image'):
  //       return (
  //         <img
  //           className={addClass ? addClass : `doc-icon`}
  //           src={this.filepath(document)}
  //           onError={() => <ImageIconSVG />}
  //         />
  //       );

  //     case _.get(document, 'type', '') == FormatTypes.Videos:
  //     case this.getFileName(name).endsWith('mov'):
  //     case this.getFileName(name).endsWith('mp4'):
  //       return <VideoIconSVG />;

  //     case _.get(document, 'type', '') == 'audio':
  //     case this.getFileName(name).endsWith('mp3'):
  //       return <Mp3IconSVG />;

  //     case this.getFileName(name).endsWith('folder'):
  //       return <FolderIconSVG />;

  //     case _.get(document, 'type', '') == FormatTypes.Link:
  //     case this.getFileName(name).endsWith('link'):
  //       return <LinkIconSVG />;

  //     case this.getFileName(name).endsWith('zip'):
  //       return <ArchiveIconSVG />;

  //     case this.getFileName(name).endsWith('xml'):
  //       return <XMLIconSVG />;

  //     case this.getFileName(name).endsWith('ipa'):
  //       return <IPAIconSVG />;

  //     case this.getFileName(name).endsWith('apk'):
  //       return <APKIconSVG />;

  //     case this.getFileName(name).endsWith('pptx'):
  //       return <PPTIconSVG />;
  //     default:
  //       return <DocsSVG />;
  //   }
  // };
}

export default new DocumentUtil();
