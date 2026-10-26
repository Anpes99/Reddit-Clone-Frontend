const SubredditIcon = ({ seed, size = 36 }) => (
  <img
    src={`https://api.dicebear.com/10.x/icons/svg?seed=${encodeURIComponent(seed)}`}
    alt=""
    width={size}
    height={size}
    style={{ borderRadius: "50%" }}
  />
);

export default SubredditIcon;
