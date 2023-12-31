interface Obj {
  [key: string]: string;
}

interface ObjWArray {
  [key: string]: string[] | boolean;
}

export function deepSearch(
  entireObj: Object,
  keyToFind: string,
  valToFind: string
) {
  const result: Obj[] = [];
  let foundObj: Obj;
  JSON.stringify(entireObj, (_, nestedValue) => {
    if (nestedValue && nestedValue[keyToFind]) {
      if (
        nestedValue[keyToFind].toLowerCase().includes(valToFind.toLowerCase())
      ) {
        foundObj = nestedValue;
        result.push(foundObj);
      }
    }
    return nestedValue;
  });
  return result;
}

export function deepSearchWithinArray(
  entireObj: Object,
  keyToFind: string,
  valToFind: string
) {
  const result: ObjWArray[] = [];
  let foundObj: ObjWArray;
  JSON.stringify(entireObj, (_, nestedValue) => {
    if (nestedValue && nestedValue[keyToFind]) {
      if (typeof nestedValue[keyToFind] === 'object') {
        foundObj = {
          ...nestedValue,
          [keyToFind]: nestedValue[keyToFind].filter((el: string) =>
            el.toLowerCase().includes(valToFind)
          ),
        };
        result.push(foundObj);
      }
    }
    return nestedValue;
  });
  return result;
}
