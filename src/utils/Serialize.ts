function SerializeObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(SerializeObject);
  }

  const newObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = SerializeObject(obj[key]);
    }
  }
  return newObj;
}

export default SerializeObject;
