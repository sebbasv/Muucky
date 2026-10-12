/**
 * Octógono "EXCESO EN SODIO" (Ley 27.642, Decreto 151/2022). Va una sola vez por página, junto a la
 * información nutricional y a un tamaño en el que "MINISTERIO DE SALUD" se lee (112 px o más).
 * [CONFIRMAR] reemplazar por el vector oficial del anexo de la normativa (el que usó el diseñador del envase).
 */
export function SodiumSeal({ size = 128, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label="Sello: exceso en sodio. Ministerio de Salud."
      className={`shrink-0 ${className}`}
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="700"
      textAnchor="middle"
      fill="#fff"
    >
      <polygon points="29.29,0 70.71,0 100,29.29 100,70.71 70.71,100 29.29,100 0,70.71 0,29.29" fill="#000" />
      <polygon
        points="30.95,4 69.05,4 96,30.95 96,69.05 69.05,96 30.95,96 4,69.05 4,30.95"
        fill="none"
        stroke="#fff"
        strokeWidth="2.2"
      />
      {/* textLength fija el ancho de cada línea: entra igual con cualquier fuente de respaldo */}
      <text x="50" y="36" fontSize="14" textLength="58" lengthAdjust="spacingAndGlyphs">
        EXCESO EN
      </text>
      <text x="50" y="62" fontSize="26" textLength="66" lengthAdjust="spacingAndGlyphs">
        SODIO
      </text>
      {/* 8,5 de 100: a 112 px de sello la línea mide 9,5 px */}
      <text x="50" y="80.5" fontSize="8.5" textLength="60" lengthAdjust="spacingAndGlyphs">
        MINISTERIO DE SALUD
      </text>
    </svg>
  );
}
