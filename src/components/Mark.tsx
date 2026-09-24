import React from "react";

// Bloque de color que barre de izquierda a derecha detrás del texto.
// Con box-decoration-break: clone funciona también en textos de varias líneas.
export const Mark: React.FC<{
  color: string;
  progress: number;
  strike?: number;
  strikeColor?: string;
  children: React.ReactNode;
}> = ({ color, progress, strike = 0, strikeColor = "#000", children }) => {
  const layers = [
    `linear-gradient(${strikeColor}, ${strikeColor})`,
    `linear-gradient(${color}, ${color})`,
  ];
  return (
    <span
      style={{
        backgroundImage: layers.join(", "),
        backgroundRepeat: "no-repeat",
        backgroundSize: `${strike * 100}% 6px, ${progress * 100}% 100%`,
        backgroundPosition: "0 56%, 0 0",
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
        padding: "0 12px",
        margin: "0 -12px",
      }}
    >
      {children}
    </span>
  );
};
