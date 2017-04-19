/**
 * Interface Export.
 * @public
 */

export interface AffineTransformer {
  readonly setupTranslate: (translateX: number, translateY: number) => AffineTransformer;
  readonly setupScale: (scaleFactor: number) => AffineTransformer;
  readonly setupRotate: (rotateAngle: number) => AffineTransformer;
  readonly transform: (point: {x: number, y: number}) => {x: number, y: number};
  readonly inverseTransform: (point: {x: number, y: number}) => {x: number, y: number};
}


/**
 * Affine Transformer Factory. It creates an affine transformation processor,
 * an object useful to transform any point using linear transformation such as
 * rotate, translate or scale.
 * @function CreateAffineTransformer
 * @return {AffineTransformer} {AffineTransformer object}
 */
export function CreateAffineTransformer(): AffineTransformer {
  const aft = {
    tx: 0,
    ty: 0,
    scale: 1,
    teta: 0,
    sinTeta: 0,
    cosTeta: 1,

    setupTranslate: (translateX: number, translateY: number) => {
      aft.tx = translateX;
      aft.ty = translateY;
      return aft;
    },

    setupScale: (scaleFactor: number) => {
      aft.scale = scaleFactor;
      return aft;
    },

    setupRotate: (rotateAngle: number) => {
      aft.teta = -1 * (Math.PI / 180) * rotateAngle;
      aft.sinTeta = Math.sin(aft.teta);
      aft.cosTeta = Math.cos(aft.teta);
      return aft;
    },

    transform: (point: {x: number, y: number}): {x: number, y: number} => {
      return {
        x: ((point.x * aft.cosTeta) - (point.y * aft.sinTeta)) * aft.scale + aft.tx,
        y: ((point.x * aft.sinTeta) + (point.y * aft.cosTeta)) * aft.scale + aft.ty,
      };
    },

    inverseTransform: (point: {x: number, y: number}): {x: number, y: number} => {
      // For inverse transform, use inverted translation factors and also
      // apply inverted teta (change sin sign) and inverted scale.
      return {
        x: (((point.x - aft.tx) * aft.cosTeta) + ((point.y - aft.ty) * aft.sinTeta)) / aft.scale,
        y: (-((point.x - aft.tx) * aft.sinTeta) + ((point.y - aft.ty) * aft.cosTeta)) / aft.scale,
      };
    },
  } as AffineTransformer;

  return aft;
}
