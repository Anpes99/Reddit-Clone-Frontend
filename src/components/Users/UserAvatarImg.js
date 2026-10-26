const UserAvatarImg = ({ url, size = 36, altSrc = "" }) => (
  <img
    src={url || altSrc}
    width={size}
    height={size}
    style={{ borderRadius: "50%" }}
  />
);

export default UserAvatarImg;
