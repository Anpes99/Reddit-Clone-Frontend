import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Popper, Paper, Fade } from "@mui/material";
import Axios from "../../shared/lib/axios";

const OPEN_DELAY_MS = 400;
const CLOSE_DELAY_MS = 200;
const CACHE_TTL_MS = 60 * 1000;

export const createCachedFetcher = () => {
  const cache = new Map();
  return (url) => {
    const cached = cache.get(url);
    if (cached && Date.now() - cached.time < CACHE_TTL_MS) {
      return cached.request;
    }
    const request = Axios.get(url)
      .then((res) => res.data)
      .catch((e) => {
        cache.delete(url);
        throw e;
      });
    cache.set(url, { request, time: Date.now() });
    return request;
  };
};

const HoverCard = ({ href, fetchData, renderPopupContent, children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle");
  const openTimerRef = useRef(null);
  const closeTimerRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(
    () => () => {
      clearTimeout(openTimerRef.current);
      clearTimeout(closeTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!anchorEl) return;
    const close = () => setAnchorEl(null);
    window.addEventListener("scroll", close, { passive: true, capture: true });
    return () => window.removeEventListener("scroll", close, { capture: true });
  }, [anchorEl]);

  const load = () => {
    if (status === "loading") return;
    if (!data) setStatus("loading");
    fetchData()
      .then((result) => {
        setData(result);
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  };

  const scheduleOpen = () => {
    clearTimeout(closeTimerRef.current);
    if (anchorEl) return;
    openTimerRef.current = setTimeout(() => {
      setAnchorEl(triggerRef.current);
      load();
    }, OPEN_DELAY_MS);
  };

  const scheduleClose = () => {
    clearTimeout(openTimerRef.current);
    closeTimerRef.current = setTimeout(() => setAnchorEl(null), CLOSE_DELAY_MS);
  };

  const close = () => {
    clearTimeout(openTimerRef.current);
    setAnchorEl(null);
  };

  return (
    <>
      <Link
        ref={triggerRef}
        to={href}
        onClick={(e) => {
          e.stopPropagation();
          close();
        }}
        onMouseEnter={scheduleOpen}
        onMouseLeave={scheduleClose}
        onFocus={scheduleOpen}
        onBlur={scheduleClose}
        className={`hover:underline cursor-pointer`}
      >
        {children}
      </Link>
      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement="bottom-start"
        transition
        style={{ zIndex: 155 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={150}>
            <Paper
              elevation={4}
              sx={{ overflow: "hidden" }}
              onMouseEnter={() => clearTimeout(closeTimerRef.current)}
              onMouseLeave={scheduleClose}
              onClick={(e) => e.stopPropagation()}
            >
              {renderPopupContent({ data, status, close })}
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default HoverCard;
