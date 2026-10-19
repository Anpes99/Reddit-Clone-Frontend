const UserAvatarImg = ({ url, size = 36 }) => (
  <img
    src={url}
    alt=""
    width={size}
    height={size}
    style={{ borderRadius: "50%" }}
  />
);

export default UserAvatarImg;
