import { get } from 'lodash';

class UploadUtil {
  jobId = upload => get(upload, 'jobId', null);

  progress = upload => get(upload, 'progress', null);

  status = upload => get(upload, 'status', false);
  
  message = upload => get(upload, 'message', null);
}

export default new UploadUtil();
