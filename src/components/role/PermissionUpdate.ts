import { Client, EmbedBuilder, PermissionsBitField, Role, TextChannel } from "discord.js";
import { PermissionName } from "../../constant/PermissionName";
import { ConfigCacheProps } from "../../types/ConfigCache";
import { CodeBlock } from "../../utils/codeBlock";

const invalidPermission = ["RequestToSpeak"];

export const PermissionUpdate = (
	client: Client,
	oldRole: Role,
	newRole: Role,
	embed: EmbedBuilder,
	config: ConfigCacheProps,
) => {
	const permissions: string[] = [];

	const oldPermission = new PermissionsBitField(oldRole.permissions.bitfield).toArray();
	const newPermission = new PermissionsBitField(newRole.permissions.bitfield).toArray();

	oldPermission.forEach((permission) => {
		if (!newPermission.includes(permission) && !invalidPermission.includes(permission)) {
			permissions.push(`${PermissionName.get(permission)}: ✔ to ✘`);
		}
	});

	newPermission.forEach((permission) => {
		if (!oldPermission.includes(permission) && !invalidPermission.includes(permission)) {
			permissions.push(`${PermissionName.get(permission)}: ✘ to ✔`);
		}
	});

	permissions.sort((a, b) => a.localeCompare(b));

	embed.addFields([
		{
			name: "Permissions",
			value: CodeBlock(permissions.join("\n")),
		},
	]);

	const configChannel = client.channels.cache.get(config.channelConfig.channelId) as TextChannel;
	return configChannel.send({ embeds: [embed] });
};
