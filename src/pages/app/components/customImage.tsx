import { HTMLProps, ReactNode, useState } from "react"

type ImgProps = HTMLProps<HTMLImageElement> & {
  fallbackUrl?:  string
}

const CustomImage = (props: ImgProps) => {
  const { fallbackUrl = null } = props;
  const [isBroken, setIsBroken] = useState(false);

  function handleError() {
    setIsBroken(true)
  }

  if (isBroken || !props?.src) {
    // @ts-ignore
    return <img {...props} src={fallbackUrl} />;
  }

  return <img onError={handleError} {...props} />
}

export default CustomImage;