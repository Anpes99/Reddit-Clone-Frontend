import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const FeedItemSkeleton = () => {
  return (
    <Stack spacing={1} sx={{ p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Skeleton variant="circular" width={44} height={44} />
        <Stack sx={{ flex: 1 }}>
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="25%" />
        </Stack>
      </Stack>

      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="70%" />

      <Skeleton variant="rounded" height={200} animation="wave" />
    </Stack>
  );
};
export default FeedItemSkeleton;
