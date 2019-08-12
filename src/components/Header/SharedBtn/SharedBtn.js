import React, { useEffect, useState, useRef } from "react";
import "./ShareBtn.css";
import { ShareIcon } from "../../Icons/Icons";
import Toast from "../../Toast/Toast";

const SharedBtn = () => {
  const [shareUrl, setShareUrl] = useState("algo");
  const [showCopied, setShowCopied] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    setInterval(() => {
      setShowCopied(false);
    }, 5000);
  }, [showCopied]);

  return (
    <>
      <Toast extShow={showCopied} text="Enlace copiado!" />
      <input
        className="share-url"
        type="text"
        ref={textRef}
        value={shareUrl}
        onChange={e => setShareUrl(e.target.value)}
      />
      <button
        className="share-btn"
        onClick={() => {
          if (navigator.share) {
            navigator
              .share({
                title: "Horarios El Villarino 319",
                text: "Consultá los horarios de la 319.",
                url: "http://google.com/"
              })
              .then(() => console.log("EXITO!"))
              .catch(error => console.log("error", error));
          } else {
            if (document.queryCommandSupported("copy")) {
              textRef.current.select();
              document.execCommand("copy");
              setShowCopied(true);
            }
          }
        }}
      >
        <ShareIcon />
        <span>Compartir App</span>
      </button>
    </>
  );
};

export default SharedBtn;
