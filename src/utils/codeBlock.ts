export const CodeBlock = (text: string = "", type: string = "yaml") => {
	return `\`\`\`${type}\n${text}\`\`\``;
};
