import { useEffect } from 'preact/hooks';

const { VITE_CLIENT_NAME: CLIENT_NAME } = import.meta.env;

export default (title) => {
  useEffect(() => {
    document.title = title ? `${title} - ${CLIENT_NAME}` : CLIENT_NAME;
  }, [title]);
};
