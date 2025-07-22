import { toast } from 'react-toastify';
import { ErrorSVG, InfoSVG, WarningSVG, SuccessSVG } from '../static/svgs';
import { MomentFormats, Titles, Types } from '../static/Constants';
import { AppRoutes } from '../static';
import moment from 'moment-timezone';
import UserUtil from './UserUtil';
import DocumentUtil from './DocumentUtil';
import _ from 'lodash';

function isDevEnv() {
  return process.env.NODE_ENV === 'development';
}

const getFileFolderOptions = (fileFolder, location) => {
  let finalArray = [];

  switch (location.pathname) {
    case AppRoutes.Favourites:
      finalArray = [
        {
          title: Titles.Archive,
        },
        {
          title: Titles.CopyTo,
        },
        {
          title: Titles.MoveTo,
        },
        {
          title: Titles.Unfavourite,
        },
        {
          title: Titles.Delete,
        },
      ];
      break;
    case AppRoutes.Archived:
      finalArray = [
        {
          title: Titles.Unarchive,
        },
        {
          title: Titles.Delete,
        },
      ];
      break;
    case AppRoutes.Deleted:
      finalArray = [
        {
          title: Titles.Restore,
        },
        {
          title: Titles.DeleteForever,
        },
      ];
      break;
    case AppRoutes.Shared:
      finalArray = [];
      break;
    default:
      finalArray = [
        {
          title: Titles.Details,
        },
        {
          title: Titles.Rename,
        },
        // !DocumentUtil.isFolder(fileFolder) && {
        //   title: Titles.Share,
        // },
        { title: Titles.Share }, 
        { title: Titles.Download },
        {
          title: DocumentUtil.isArchive(fileFolder)
            ? Titles.Unarchive
            : Titles.Archive,
        },
        {
          title: Titles.CopyTo,
        },
        {
          title: Titles.MoveTo,
        },
        {
          title: DocumentUtil.isFavorite(fileFolder)
            ? Titles.Unfavourite
            : Titles.Favourite,
        },
        {
          title: Titles.Delete,
        },
      ];
      break;
  }

  return finalArray;
};

function isUrl(string) {
  // Prepend http:// if the string doesn't have a protocol
  if (!/^https?:\/\//i.test(string)) {
    string = 'http://' + string;
  }

  const urlPattern = new RegExp(
    '^https?:\\/\\/' + // Protocol (http or https)
      '(([a-zA-Z\\d-]+\\.)*[a-zA-Z\\d-]+\\.[a-zA-Z]{2,})' + // Domain and subdomains
      '(\\:\\d+)?' + // Port (optional)
      '(\\/[-a-zA-Z\\d%_.~+]*)*' + // Path (optional)
      '(\\?[;&a-zA-Z\\d%_.~+=-]*)?' + // Query string (optional)
      '(\\#[-a-zA-Z\\d_]*)?$', // Fragment (optional)
    'i' // Case insensitive
  );

  return urlPattern.test(string);
}

function isNotEmpty(data) {
  return !_.isEmpty(data, true);
}

function isEmpty(data) {
  return _.isEmpty(data, true);
}

const isArray = dataSet => {
  return Array.isArray(dataSet);
};

function hexToRgb(hex, opacity) {
  // Remove the hash sign if present
  hex = hex.replace(/^#/, '');

  // Parse the hexadecimal color code
  const bigint = parseInt(hex, 16);

  // Extract the RGB components
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Apply the opacity (alpha channel)
  const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;
  return rgba;
}

const getInitials = user => {
  const firstname = UserUtil.firstName(user);
  const lastname = UserUtil.lastName(user);

  if (firstname && lastname) {
    return `${firstname.charAt(0).toUpperCase()}${lastname
      .charAt(0)
      .toUpperCase()}`;
  }

  // Fallback for when first and last names are not available
  const names = user.trim().split(/\s+/); // Split by any number of spaces

  let initials = names[0] ? names[0].charAt(0).toUpperCase() : '';

  if (names.length > 1) {
    initials += names[names.length - 1].charAt(0).toUpperCase();
  }

  return initials;
};

function truncateText(text = '', maxLength = 10) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
}

const mapDateWiseData = (
  dataArray = [],
  isAscending = false,
  isModifiedDate = false
) => {
  if (isModifiedDate) {
    let sortKey = 'createdAt';

    // if (tabTitle == TabsTitles.Archive) sortKey = 'archivedAt';
    // else if (tabTitle == TabsTitles.Favorite) sortKey = 'favouritedAt';
    // else if (tabTitle == TabsTitles.RecycleBin) sortKey = 'deletedAt';
    // else if (tabTitle == TabsTitles.Shared) sortKey = 'sharedCreatedAt';
    // else sortKey = 'createdAt';

    let sortedArray = [...dataArray].sort((itemA, itemB) => {
      const dateA = new Date(_.get(itemA, sortKey, null));
      const dateB = new Date(_.get(itemB, sortKey, null));
      return isAscending ? dateB - dateA : dateA - dateB;
    });

    const groupByDate = sortedArray.reduce((acc, current) => {
      const date = DocumentUtil.createdAt(current);

      if (!acc[date]) {
        acc[date] = {
          date: date,
          data: [],
        };
      }

      acc[date].data.push(current);
      return acc;
    }, {});

    let groupedArray = Object.values(groupByDate);

    // Sort each group's data based on 'createdAt'
    groupedArray = groupedArray.map(group => {
      group.data.sort((itemA, itemB) => {
        const dateA = new Date(_.get(itemA, sortKey, null));
        const dateB = new Date(_.get(itemB, sortKey, null));
        return isAscending ? dateB - dateA : dateA - dateB;
      });
      return group;
    });

    return groupedArray;
  } else {
    let finalArray = [...dataArray].sort((itemA, itemB) => {
      const nameA = DocumentUtil.name(itemA)?.toLowerCase() || '';
      const nameB = DocumentUtil.name(itemB)?.toLowerCase() || '';

      if (nameA < nameB) return isAscending ? -1 : 1;
      if (nameA > nameB) return isAscending ? 1 : -1;
      return 0;
    });

    return finalArray;
  }
};

const isValidPhoneNumber = phoneNumber => {
  const regex =
    /^[\+]?[0-9]{0,3}\W?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return regex.test(phoneNumber);
};

const isValidEmail = email => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const getPasswordStrength = password => {
  if (password.length === 0) {
    return '';
  }

  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^a-zA-Z0-9]/.test(password);

  if (password.length < 8 || !(hasLetters && hasNumbers && hasSymbols)) {
    return Types.Weak;
  } else if (password.length < 10) {
    return Types.Medium;
  } else {
    return Types.Strong;
  }
};

const getQueryParams = (params, searchParams) => {
  for (const [key, value] of Object.entries(params)) {
    if (isNotEmpty(value)) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
  }

  return searchParams.toString();
};

const getParamValue = (key, searchParams) => {
  return searchParams.get(key) ? searchParams.get(key).toString() : '';
};

function formatFileSize(bytes) {
  if (bytes) {
    if (bytes < 1024) {
      return bytes + ' Bytes';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else if (bytes < 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    } else {
      return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
  }
}

function showToast(message, type = 'success', options = {}) {
  const defaultOptions = {
    autoClose: 3000, // Disable auto-close by default for manual control
    icon: null, // Default icon
  };

  // Merge default options with custom options
  const toastOptions = { ...defaultOptions, ...options };

  let toastId;

  // Determine the icon and show the toast based on the type
  if (type === 'error') {
    toastOptions.icon = <ErrorSVG />;
    toastId = toast.error(message, toastOptions);
  } else if (type === 'info') {
    toastOptions.icon = <InfoSVG />;
    toastId = toast.info(message, toastOptions);
  } else if (type === 'warning') {
    toastOptions.icon = <WarningSVG />;
    toastId = toast.warning(message, toastOptions);
  } else {
    toastOptions.icon = <SuccessSVG />;
    toastId = toast.success(message, toastOptions);
  }

  // Dismiss the toast after 5 seconds
  setTimeout(() => toast.dismiss(toastId), 3000);
}

const makeURLValid = url => {
  const hasProtocol = url.startsWith('http://') || url.startsWith('https://');
  const formattedUrl = hasProtocol ? url : `https://${url}`;
  return formattedUrl;
};

function localTZDateTime(dateTime, format = MomentFormats.dateTimeFormat) {
  const deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return moment.utc(dateTime).tz(deviceTimeZone).format(format);
}

export default {
  isDevEnv,
  localTZDateTime,
  formatFileSize,
  getParamValue,
  getQueryParams,
  isUrl,
  isNotEmpty,
  isEmpty,
  isArray,
  hexToRgb,
  getInitials,
  truncateText,
  mapDateWiseData,
  isValidEmail,
  isValidPhoneNumber,
  showToast,
  makeURLValid,
  getFileFolderOptions,
  getPasswordStrength,
};
