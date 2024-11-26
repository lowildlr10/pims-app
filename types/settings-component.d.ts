type UserProfileProps = {
  user: UserType;
};

type UserProfileUpdateSectionType = 'information' | 'signature';

type UserProfileFormProps = {
  user: UserType;
  transitionStyle?: React.CSSProperties;
};

type SignatureFormProps = {
  user: UserType;
  transitionStyle?: React.CSSProperties;
};
