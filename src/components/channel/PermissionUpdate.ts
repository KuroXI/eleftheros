import { PERMISSION_CHANGE_MSG } from "../../lib/constant";
import { AuditLogEvent, Client, EmbedBuilder, GuildChannel, TextChannel } from "discord.js";
import { ExecutorNotFound, SetExecutor } from "../../utils/util";
import { CodeBlock } from "../../utils/codeBlock";
import { ConfigCacheProps } from "../../types/ConfigCache";
import { PermissionStatus } from "../../constant/PermissionStatus";
import { PermissionBits } from "../../constant/PermissionBits";

export const PermissionResolver = (bitfield: number) => {
	const permissionArray = [];

	const permissionUpper = Math.floor(bitfield / 0x100000000);
	const permissionLower = Math.floor(bitfield % 0x100000000);

	for (const flag in PermissionBits) {
		if (
			(permissionUpper && PermissionBits[flag] >= 0x100000000 && Math.floor(PermissionBits[flag] / 0x100000000)) ||
			(permissionLower && PermissionBits[flag] < 0x100000000 && PermissionBits[flag])
		) {
			permissionArray.push(flag);
		}
	}

	return permissionArray;
};

export const PermissionStateFormat = (from: string, to: string): string => {
	return `${from} ➜ ${to}`;
};

export const PermissionNewToOld = (newPermission: string[], oldPermission: string[], type: "ALLOW" | "DENY") => {
	const permissions: string[] = [];

	newPermission.forEach((permission) => {
		if (oldPermission.find((value) => value === permission)) {
			permissions.push(
				PERMISSION_CHANGE_MSG.replace("%a", permission).replace(
					"%s",
					type === "ALLOW"
						? PermissionStateFormat(PermissionStatus.DENY, PermissionStatus.ALLOW)
						: PermissionStateFormat(PermissionStatus.ALLOW, PermissionStatus.DENY),
				),
			);
		} else {
			permissions.push(
				PERMISSION_CHANGE_MSG.replace("%a", permission).replace(
					"%s",
					type === "ALLOW"
						? PermissionStateFormat(PermissionStatus.NEUTRAL, PermissionStatus.ALLOW)
						: PermissionStateFormat(PermissionStatus.NEUTRAL, PermissionStatus.DENY),
				),
			);
		}
	});

	return permissions;
};

export const PermissionOldToNew = (oldPermission: string[], newPermission: string[], type: "ALLOW" | "DENY") => {
	const permissions: string[] = [];

	oldPermission.forEach((permission) => {
		if (newPermission.find((value) => value !== permission) || !newPermission.length) {
			permissions.push(
				PERMISSION_CHANGE_MSG.replace("%a", permission).replace(
					"%s",
					type === "ALLOW"
						? PermissionStateFormat(PermissionStatus.ALLOW, PermissionStatus.NEUTRAL)
						: PermissionStateFormat(PermissionStatus.DENY, PermissionStatus.NEUTRAL),
				),
			);
		}
	});

	return permissions;
};

export const PermissionUpdate = async (
	client: Client,
	channel: GuildChannel,
	embed: EmbedBuilder,
	config: ConfigCacheProps,
	type: string,
) => {
	embed.setTitle(`${type} Channel Permission Update`);

	const overwriteUpdateAudit = await channel.guild.fetchAuditLogs({
		type: AuditLogEvent.ChannelOverwriteUpdate,
		limit: 1,
	});

	const audit = overwriteUpdateAudit.entries.first();

	if (audit?.executor) {
		SetExecutor(audit.executor, embed, "Updated");
	} else {
		ExecutorNotFound(embed, "update the permission of", type);
	}

	const allowOld: string[] = PermissionResolver(
		(audit?.changes.find((change) => change.key === "allow")?.old as number) || 0,
	);

	const allowNew: string[] = PermissionResolver(
		(audit?.changes.find((change) => change.key === "allow")?.new as number) || 0,
	);

	const denyOld: string[] = PermissionResolver(
		(audit?.changes.find((change) => change.key === "deny")?.old as number) || 0,
	);
	const denyNew: string[] = PermissionResolver(
		(audit?.changes.find((change) => change.key === "deny")?.new as number) || 0,
	);

	const permissions = [
		...PermissionNewToOld(allowNew, denyOld, "ALLOW"),
		...PermissionOldToNew(allowOld, denyNew, "ALLOW"),
		...PermissionNewToOld(denyNew, allowNew, "DENY"),
		...PermissionOldToNew(denyOld, allowNew, "DENY"),
	];

	permissions.sort((a, b) => a.localeCompare(b));

	embed.addFields([
		{ name: "Channel Name", value: CodeBlock(channel.name), inline: true },
		{ name: "Channel ID", value: CodeBlock(channel.id), inline: true },
		{ name: "\u200b", value: permissions.join("\n"), inline: false },
	]);

	const configChannel = client.channels.cache.get(config.channelConfig.channelId) as TextChannel;
	return configChannel.send({ embeds: [embed] });
};
