import {
  EmptyArchiveSVG,
  EmptyBinSVG,
  EmptyDocsSVG,
  EmptyFavouriteSVG,
  EmptyFolderSVG,
  EmptySharedSVG,
  ArchiveSVG,
  BinSVG,
  FavouriteSVG,
  HomeSVG,
  MyDocsSVG,
  SharedSVG,
  AllDocsSVG,
  FolderSVG,
  DocsSVG,
  ImagesSVG,
  VideoSVG,
  Home,
  Archive,
  Shared,
  Favourite,
  Bin,
  MyDocs,
} from './svgs';
import AppRoutes from './AppRoutes';
import moment from 'moment';
import ENVConfig from '../configs/ENVConfig';

export const AppMessages = {
  CopyLinkError: 'Unable to copy link at this moment',
  CopiedLink: 'Link Copied To Clipboard Successfully',
  FolderDirectory: 'Please select a folder to create a new folder inside.',
  MaxFilesLimit: 'You can upload maximum 20 files at a time',
  WeakPassword:
    'Your password is too weak. Use at least 8 characters, including uppercase, lowercase, numbers, and symbols for better security.',
  UnMatchedPassword: 'Your password and confirmation password do not match.',
  InvalidEmail: 'Please enter a valid email address',
};

export const ShareOptions = [
  {
    label: 'View Only',
    value: 'view',
  },
  {
    label: 'Edit',
    value: 'edit',
  },
];

// export const initialBreadCrumbs = [{ name: 'LathranSuite' }];
export const initialBreadCrumbs = [
  { name: 'LathranSuite', LathranUrl: ENVConfig.AppUrl },
];

export const GeneralSuccessMsg = 'Request Submitted Successfully';

export const backgroundImage =
  'url(https://dubaitechnologynow.com/assets/admin/media/logos/background-image.jpg)';
export const TabsTitles = {
  Home: 'Home',
  MyDocs: 'My Docs',
  Favorites: 'Favorites',
  Shared: 'Shared',
  Archive: 'Archive',
  Bin: 'Bin',
  All: 'All',
  Folders: 'Folders',
  Docs: 'Docs',
  Images: 'Images',
  Videos: 'Videos',
};

export const FormatTypes = {
  All: 'all',
  Folder: 'folder',
  Shared: 'shared',
  Documents: 'document',
  Images: 'image',
  Videos: 'video',
  Link: 'link',
};

export const Types = {
  SortBy: 'Sort By',
  FilterBy: 'Filter By',
  OrderBy: 'Order By',
  Custom: 'custom',
  Weak: 'weak',
};

export const navItemsList = [
  {
    title: TabsTitles.Home,
    icon: <Home />,
    route: AppRoutes.Home,
  },
  {
    title: TabsTitles.MyDocs,
    icon: <MyDocs />,
    route: AppRoutes.MyDocs,
  },
  {
    title: TabsTitles.Favorites,
    icon: <Favourite />,
    route: AppRoutes.Favourites,
  },
  {
    title: TabsTitles.Shared,
    icon: <Shared />,
    route: AppRoutes.Shared,
  },
  {
    title: TabsTitles.Archive,
    icon: <Archive />,
    route: AppRoutes.Archived,
  },
  {
    title: TabsTitles.Bin,
    icon: <Bin />,
    route: AppRoutes.Deleted,
  },
];

export const NavFilterItemsList = [
  {
    title: TabsTitles.All,
    icon: <AllDocsSVG />,
    format: FormatTypes.All,
  },
  {
    title: TabsTitles.Folders,
    icon: <FolderSVG />,
    format: FormatTypes.Folder,
  },
  {
    title: TabsTitles.Docs,
    icon: <DocsSVG />,
    format: FormatTypes.Documents,
  },
  {
    title: TabsTitles.Images,
    icon: <ImagesSVG />,
    format: FormatTypes.Images,
  },
  {
    title: TabsTitles.Videos,
    icon: <VideoSVG />,
    format: FormatTypes.Videos,
  },
];

export const OptionTitles = {
  UploadFile: 'Upload File',
  UploadFolder: 'Upload Folder',
  CreateNewFolder: 'Create New Folder',
  CreateNewLink: 'Create New Link',
  Share: 'Share',
  Move: 'Move',
  Restore: 'Restore',
  Delete: 'Delete',
  DeleteForever: 'Delete Forever',
  More: 'More',
  Rename: 'Rename',
  AddToFavourite: 'Add to Favourite',
  RemoveFromFavourites: 'Remove from Favourites',
  MakeACopy: 'Make a Copy',
  Download: 'Download',
  AddToArchive: 'Add to Archive',
  UnArchive: 'Unarchive',
  RemoveFromArchives: 'Remove from Archives',
  CopyLink: 'Copy Link',
  Details: 'Details',
};

export const MomentFormats = {
  defaultDate: 'MM-DD-YYYY',
  dateTime: 'MMM-DD-YYYY - hh:mm A',
  MMMYYYY: 'MMM YYYY',
  defaultTime: 'hh:mm A',
  HHMMAP: 'hh:mm A',
  LL: 'LL',
  firstDay: 'YYYY-MM-01',
  YYYYMMDD: 'YYYY-MM-DD',
  server: 'YYYY-MM-DD HH:mm:ss',
  dateTimeFormat: 'hh:mm A - MMM, DD YYYY',
  MMMMDYYYY: 'MMM D, YYYY',
  apiBody: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  apiBody2: 'YYYY-MM-DDTHH:mm:ss',
  download_file: 'DD_MMM_YYYY_hh_mm_ss_A',
};

export const UserTypes = {
  Developer: 1,
  Manager: 12,
  DepartmentHead: 28,
  Associate: 33,
  Admin: 34,
};

export const EmptyScreens = [
  {
    icon: <EmptyDocsSVG />,
    title: 'Your Document Hub is Ready!',
    description:
      'Start organizing your important files. Upload documents, create folders, and manage everything in one place.',
    route: AppRoutes.Home,
  },
  {
    icon: <EmptyDocsSVG />,
    title: 'Your Document Hub is Ready!',
    description:
      'Start organizing your important files. Upload documents, create folders, and manage everything in one place.',
    route: AppRoutes.MyDocs,
  },
  {
    icon: <EmptyFavouriteSVG />,
    title: 'No Favorite Files!',
    description: 'Add stars to things that you want to easily find later.',
    route: AppRoutes.Favourites,
  },
  {
    icon: <EmptyArchiveSVG />,
    title: 'Nothing in Archive',
    description: `Store items you want to keep but don't need to access frequently in the archive. Archived items will remain here until you choose to restore or permanently delete them.`,
    route: AppRoutes.Archived,
  },
  {
    icon: <EmptySharedSVG />,
    title: 'Nothing in Shared',
    description: `When someone shares any documents with you, they will show up here.`,
    route: AppRoutes.Shared,
  },
  {
    icon: <EmptyBinSVG />,
    title: 'Nothing in Trash',
    description: `Move items you no longer need to the trash. Items in the trash will be automatically deleted forever after 30 days.`,
    route: AppRoutes.Deleted,
  },
  {
    icon: <EmptyFolderSVG />,
    title: 'Nothing in Folder',
    description: ``,
    route: AppRoutes.FolderDetails,
  },
];
export const SortBy = [
  {
    label: 'Name',
    value: 'name',
  },
  {
    label: 'Size',
    value: 'size',
  },
  {
    label: 'Type',
    value: 'type',
  },
  {
    label: 'Created At',
    value: 'createdAt',
  },
  {
    label: 'Updated At',
    value: 'updatedAt',
  },
];

export const OrderBy = [
  {
    label: 'Ascending',
    value: 'ASC',
  },
  {
    label: 'Descending',
    value: 'DESC',
  },
];

export const Filters = [
  {
    label: 'All',
    value: 'all',
    from_date: '1970-01-01',
    to_date: moment().format(MomentFormats.YYYYMMDD),
  },
  {
    label: 'Today',
    value: 'today',
    from_date: moment().format(MomentFormats.YYYYMMDD),
    to_date: moment().format(MomentFormats.YYYYMMDD),
  },
  {
    label: 'Yesterday',
    value: 'yesterday',
    from_date: moment().subtract(1, 'days').format(MomentFormats.YYYYMMDD),
    to_date: moment().subtract(1, 'days').format(MomentFormats.YYYYMMDD),
  },
  {
    label: 'Last Week',
    value: 'last_week',
    from_date: moment()
      .subtract(1, 'weeks')
      .startOf('week')
      .format(MomentFormats.YYYYMMDD),
    to_date: moment()
      .subtract(1, 'weeks')
      .endOf('week')
      .format(MomentFormats.YYYYMMDD),
  },
  {
    label: 'Last Month',
    value: 'last_month',
    from_date: moment()
      .subtract(1, 'months')
      .startOf('month')
      .format(MomentFormats.YYYYMMDD),
    to_date: moment()
      .subtract(1, 'months')
      .endOf('month')
      .format(MomentFormats.YYYYMMDD),
  },
  {
    label: 'Last Quarter',
    value: 'last_quarter',
    from_date: moment()
      .subtract(1, 'quarters')
      .startOf('quarter')
      .format(MomentFormats.YYYYMMDD),
    to_date: moment()
      .subtract(1, 'quarters')
      .endOf('quarter')
      .format(MomentFormats.YYYYMMDD),
  },
  {
    label: 'Last Year',
    value: 'last_year',
    from_date: moment()
      .subtract(1, 'years')
      .startOf('year')
      .format(MomentFormats.YYYYMMDD),
    to_date: moment()
      .subtract(1, 'years')
      .endOf('year')
      .format(MomentFormats.YYYYMMDD),
  },
  {
    label: 'This Week',
    value: 'this_week',
    from_date: moment().startOf('week').format(MomentFormats.YYYYMMDD),
    to_date: moment().format(MomentFormats.YYYYMMDD),
  },
  {
    label: 'This Month',
    value: 'this_month',
    from_date: moment().startOf('month').format(MomentFormats.YYYYMMDD),
    to_date: moment().format(MomentFormats.YYYYMMDD),
  },
  {
    label: 'This Quarter',
    value: 'this_quarter',
    from_date: moment().startOf('quarter').format(MomentFormats.YYYYMMDD),
    to_date: moment().format(MomentFormats.YYYYMMDD),
  },
  {
    label: 'This Year',
    value: 'this_year',
    from_date: moment().startOf('year').format(MomentFormats.YYYYMMDD),
    to_date: moment().format(MomentFormats.YYYYMMDD),
  },
  {
    label: 'Custom',
    value: 'custom',
  },
];

export const Titles = {
  Details: 'Details',
  Rename: 'Rename',
  Share: 'Share',
  Download: 'Download',
  MoveTo: 'Move To',
  CopyTo: 'Copy To',
  Favourite: 'Favourite',
  Unfavourite: 'Unfavourite',
  Archive: 'Archive',
  Unarchive: 'Unarchive',
  Delete: 'Delete',
  Restore: 'Restore',
  DeleteForever: 'Delete Forever',
};

export const FileFolderActionItems = [
  {
    title: Titles.Details,
  },
  {
    title: Titles.Rename,
  },
  {
    title: Titles.Share,
  },
  {
    title: Titles.Download,
  },
  {
    title: Titles.MoveTo,
  },
  {
    title: Titles.CopyTo,
  },
  {
    title: Titles.Favourite,
  },
  {
    title: Titles.Unfavourite,
  },
  {
    title: Titles.Archive,
  },
  {
    title: Titles.Unarchive,
  },
  {
    title: Titles.Delete,
  },
];
