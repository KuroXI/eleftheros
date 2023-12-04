import { AuditLogEvent, Client, EmbedBuilder, Role, TextChannel } from "discord.js";
import { EventProps } from "../types/EventProps";
import { guildConfigCache } from "../lib/cache";
import { ColorType } from "../constant/ColorType";
import { CodeBlock } from "../utils/codeBlock";
import { ExecutorNotFound, SetExecutor } from "../utils/util";
import { PermissionUpdate } from "../components/role/PermissionUpdate";

const RoleUpdate: EventProps = {
	name: "roleUpdate",
	once: false,
	handler: async (client: Client, oldRole: Role, newRole: Role) => {
		const config = guildConfigCache.get(oldRole.guild.id || newRole.guild.id);

		if (
			typeof config === "undefined" ||
			!config.roleConfig.isEnable ||
			!config.roleConfig.isRoleUpdateEnable ||
			!client.channels.resolveId(config.roleConfig.channelId) ||
			oldRole.rawPosition !== newRole.rawPosition
		)
			return;

		const embed = new EmbedBuilder()
			.setColor(ColorType.UPDATE)
			.setTitle("Role Update")
			.addFields([{ name: "ID", value: CodeBlock(oldRole.id || newRole.id), inline: false }]);

		if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
			return PermissionUpdate(client, oldRole, newRole, embed, config);
		}

		const roleUpdateAudit = await oldRole.guild.fetchAuditLogs({
			type: AuditLogEvent.RoleUpdate,
			limit: 1,
		});

		const audit = roleUpdateAudit.entries.first();
		const resultOldSetting: string[] = [];
		const resultNewSetting: string[] = [];

		if (audit?.executor) {
			SetExecutor(audit.executor, embed, "Updated");
		} else {
			ExecutorNotFound(embed, "updated", "role");
		}

		if (oldRole.name !== newRole.name) {
			resultOldSetting.push(`Name: ${oldRole.name}`);
			resultNewSetting.push(`Name: ${newRole.name}`);
		}

		if (oldRole.hexColor !== newRole.hexColor) {
			resultOldSetting.push(`Color: ${oldRole.hexColor.replace("#", "").toUpperCase()}`);
			resultNewSetting.push(`Color: ${newRole.hexColor.replace("#", "").toUpperCase()}`);
		}

		if (oldRole.icon !== newRole.icon) {
			embed.setThumbnail(newRole.icon ? newRole.iconURL({ size: 4096 }) : null);
		}

		if (oldRole.mentionable !== newRole.mentionable) {
			resultOldSetting.push(`Mentionable: ${oldRole.mentionable}`);
			resultNewSetting.push(`Mentionable: ${newRole.mentionable}`);
		}

		if (oldRole.hoist !== newRole.hoist) {
			resultOldSetting.push(`Display Separately: ${oldRole.hoist}`);
			resultNewSetting.push(`Display Separately: ${newRole.hoist}`);
		}

		embed.addFields([
			{ name: "Before", value: CodeBlock(resultOldSetting.join("\n")), inline: true },
			{ name: "After", value: CodeBlock(resultNewSetting.join("\n")), inline: true },
		]);

		const configChannel = client.channels.cache.get(config.channelConfig.channelId) as TextChannel;
		return configChannel.send({ embeds: [embed] });
	},
};

export default RoleUpdate;
