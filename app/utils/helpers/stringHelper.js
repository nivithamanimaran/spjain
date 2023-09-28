// method that takes input as "application[firstName]" and return {objectName:"application", fieldName:"firstName" }
export const getSplitName = (combinedName, key, returnArray = false) => {
	const obj = {
		objectName: "",
		fieldName: "",
	};
	const replaceBrackets = combinedName.replace(/[\[\]']+/g, " ")?.trim();
	const splitStr = replaceBrackets?.split(" ");
	if (Array.isArray(splitStr) && splitStr.length > 0) {
		obj.objectName = splitStr[0];
		obj.fieldName = splitStr[1];
	}
	if (key === "objectName") return obj.objectName;
	if (key === "fieldName") return obj.fieldName;
	if (returnArray) return splitStr;
	return obj;
};

export const getNameById = (identifier, array, findBy, expectedKey) => {
	const obj = array?.find((item) => item[findBy] === identifier);
	if (!obj) return "";
	return obj[expectedKey];
};
