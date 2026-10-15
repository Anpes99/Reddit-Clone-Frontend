const UserAvatarImg = ({ seed, size = 36 }) => (
  <img
    src={`https://api.dicebear.com/10.x/voxel-art/svg?scale=1.25&seed=${encodeURIComponent(seed)}`}
    alt=""
    width={size}
    height={size}
    style={{ borderRadius: "50%" }}
  />
);

export default UserAvatarImg;
