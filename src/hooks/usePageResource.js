import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Axios from "../shared/lib/axios";

const usePageResource = (url, { onSuccess, refetchKey } = {}) => {
  const [result, setResult] = useState({ url: null, status: null });
  const [retryCount, setRetryCount] = useState(0);

  // Keep the latest callback without making it an effect dependency.
  const onSuccessRef = useRef(onSuccess);
  useLayoutEffect(() => {
    onSuccessRef.current = onSuccess;
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      let res;
      try {
        res = await Axios.get(url);
      } catch (e) {
        if (cancelled) return;
        setResult({
          url,
          status: e.response?.status === 404 ? "notFound" : "error",
        });
        return;
      }
      if (cancelled) return;
      onSuccessRef.current?.(res.data);
      setResult({ url, status: "ok" });
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [url, refetchKey, retryCount]);

  const retry = useCallback(() => setRetryCount((c) => c + 1), []);

  const status = result.url === url ? result.status : "loading";

  return { status, retry };
};

export default usePageResource;
