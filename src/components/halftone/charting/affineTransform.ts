/**
 * Interface Export.
 * @public
 */

export interface AffineTransformer {
  readonly setupTranslate: (translateX: number, translateY: number) => AffineTransformer;
  readonly setupScale: (scaleFactor: number) => AffineTransformer;
  readonly setupRotate: (rotateAngle: number) => AffineTransformer;
  readonly setupAnchorPoint: (point: {x: number, y: number}) => AffineTransformer;
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
    anchorPoint: {x: 0, y: 0},
    aptx: 0,
    apty: 0,

    setupTranslate: (translateX: number, translateY: number) => {
      aft.tx = translateX;
      aft.ty = translateY;
      aft.updateAnchorPoint();
      return aft;
    },

    setupScale: (scaleFactor: number) => {
      aft.scale = scaleFactor;
      aft.updateAnchorPoint();
      return aft;
    },

    setupRotate: (rotateAngle: number) => {
      aft.teta = -1 * (Math.PI / 180) * rotateAngle;
      aft.sinTeta = Math.sin(aft.teta);
      aft.cosTeta = Math.cos(aft.teta);
      aft.updateAnchorPoint();
      return aft;
    },

    setupAnchorPoint: (point: {x: number, y: number}) => {
      aft.anchorPoint = point;
      aft.updateAnchorPoint();
      return aft;
    },

    updateAnchorPoint: () => {
      const anchorPointTransformed = aft.transform(aft.anchorPoint);
      aft.aptx = aft.anchorPoint.x - anchorPointTransformed.x;
      aft.apty = aft.anchorPoint.y - anchorPointTransformed.y;
    },

    transform: (point: {x: number, y: number}): {x: number, y: number} => {
      return {
        x: ((point.x * aft.cosTeta) - (point.y * aft.sinTeta)) * aft.scale + aft.tx + aft.aptx,
        y: ((point.x * aft.sinTeta) + (point.y * aft.cosTeta)) * aft.scale + aft.ty + aft.apty,
      };
    },

    inverseTransform: (point: {x: number, y: number}): {x: number, y: number} => {
      // For inverse transform, use inverted translation factors for scale and rotation and also
      // apply inverted teta (change sin sign) for rotation and negated translation.
      return {
        x: ((point.x * aft.cosTeta) + (point.y * aft.sinTeta)) / aft.scale - aft.tx - aft.aptx,
        y: (-(point.x * aft.sinTeta) + (point.y * aft.cosTeta)) / aft.scale - aft.ty - aft.apty,
      };
    },
  } as AffineTransformer;

  return aft;
}
