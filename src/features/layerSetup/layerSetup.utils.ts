import { LayerStack, CreateDefaultLayerParams,
         CloneLayerParams, LayerParameters } from "../../models/layerModel";
import { arrayMove } from "react-sortable-hoc";

const isLayerNameDuplicated = (ls: LayerStack, name: string) => {
  return Boolean(ls.find((item) => item.name === name));
};

export const isLayerNameValid = (ls: LayerStack, name: string) => {
  const trimmedName = name.trim();
  let error = "";
  let ok = true;
  if (/^\s*$/.test(trimmedName)) {
    ok = false;
  } else if (isLayerNameDuplicated(ls, trimmedName)) {
    error = "Layer already exists";
    ok = false;
  }

  return { ok, error };
};

export const synchZindex = (ls: LayerStack): LayerStack => {
  return ls.map((item, index) => {
    return {
      ...CloneLayerParams(item),
      zIndex: index,
    };
  });
};

export const addLayer = (ls: LayerStack, newLayerName: string) => {
  return synchZindex([
    {...CreateDefaultLayerParams(), name: newLayerName},
    ...ls,
  ]);
};

export const removeLayer = (ls: LayerStack, targetLayerName: string) => {
  return synchZindex( ls.filter((item) => item.name !== targetLayerName) );
};

export const sortLayer = (ls: LayerStack, oldIndex: number, newIndex: number): LayerStack => {
  return synchZindex( arrayMove(ls, oldIndex, newIndex) );
};

export const renameLayer = (ls: LayerStack, oldName: string, newName: string): LayerStack => {
  return ls.map((item) => {
   if (item.name === oldName) {
    return {...CloneLayerParams(item), name: newName};
   } else {
     return {...CloneLayerParams(item)};
  }});
};

export const replaceLayerParams = (ls: LayerStack, targetLayerName: string, lp: LayerParameters) => {
  return ls.map((item) => {
   if (item.name === targetLayerName) {
    return {...CloneLayerParams(lp)};
   } else {
     return {...CloneLayerParams(item)};
  }});
};

export const cloneLayerStack = (ls: LayerStack): LayerStack => {
 return ls.map((item) => CloneLayerParams(item));
};

