import moment from 'moment';

export const timeAgo = (timestamp) => moment(timestamp).fromNow()