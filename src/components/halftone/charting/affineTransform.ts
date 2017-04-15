/**
 * Interface Export.
 * @public
 */

export interface AffineTransformer {
  setupTranslate: (translateX: number, translateY: number) => AffineTransformer;
    setupScale: (scaleFactor: number, scalingPoint: {
        x: number;
        y: number;
    }) => AffineTransformer;
    setupRotate: (rotateAngle: number, rotationPoint: {
        x: number;
        y: number;
    }) => AffineTransformer;
    transform: (point: {
        x: number;
        y: number;
    }) => {
        x: number;
        y: number;
    };
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
    stx: 0,
    sty: 0,

    teta: 0,
    sinTeta: 0,
    cosTeta: 1,
    rtx: 0,
    rty: 0,

    setupTranslate: (translateX: number, translateY: number) => {
      aft.tx = translateX;
      aft.ty = translateY;
      return aft;
    },

    setupScale: (scaleFactor: number, scalingPoint: {x: number, y: number}) => {
      aft.scale = scaleFactor;

      // In order to scale around a scaling point, lets translate by that scaling
      // point already scaled.
      aft.stx = scalingPoint.x * (1 - scaleFactor);
      aft.sty = scalingPoint.y * (1 - scaleFactor);
      return aft;
    },

    setupRotate: (rotateAngle: number, rotationPoint: {x: number, y: number}) => {
      aft.teta = -1 * (Math.PI / 180) * rotateAngle;
      aft.sinTeta = Math.sin(aft.teta);
      aft.cosTeta = Math.cos(aft.teta);

      // In order to rotate around the center point, lets translate by the difference
      // between the center point and the rotated center point.
      aft.rtx = rotationPoint.x - ((rotationPoint.x * aft.cosTeta) - (rotationPoint.y * aft.sinTeta));
      aft.rty = rotationPoint.y - ((rotationPoint.x * aft.sinTeta) + (rotationPoint.y * aft.cosTeta));
      return aft;
    },

    transform: (point: {x: number, y: number}): {x: number, y: number} => {
      return {
        x: ((point.x * aft.cosTeta) - (point.y * aft.sinTeta)) * aft.scale + (aft.tx + aft.stx + aft.rtx),
        y: ((point.x * aft.sinTeta) + (point.y * aft.cosTeta)) * aft.scale + (aft.ty + aft.sty + aft.rty),
      };
    },
  } as AffineTransformer;

  return aft;
}
