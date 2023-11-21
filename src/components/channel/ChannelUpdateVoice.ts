import { VoiceChannel } from "discord.js";
import { Regions } from "../../constant/Regions";

export const ChannelUpdateVoice = (oldChannel: VoiceChannel, newChannel: VoiceChannel) => {
	const resultOld: string[] = [];
	const resultNew: string[] = [];

	if (oldChannel.nsfw !== newChannel.nsfw) {
		resultOld.push(`Age Restrict: ${oldChannel.nsfw}`);
		resultNew.push(`Age Restrict: ${newChannel.nsfw}`);
	}

	if (oldChannel.bitrate !== newChannel.bitrate) {
		resultOld.push(`Bitrate: ${oldChannel.bitrate / 1000} kbps`);
		resultNew.push(`Bitrate: ${newChannel.bitrate / 1000} kbps`);
	}

	if (oldChannel.rtcRegion !== newChannel.rtcRegion) {
		resultOld.push(`Region: ${Regions.get(oldChannel.rtcRegion)}`);
		resultNew.push(`Region: ${Regions.get(newChannel.rtcRegion)}`);
	}

	if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
		resultOld.push(`Slow mode: ${oldChannel.rateLimitPerUser} second(s)`);
		resultNew.push(`Slow mode: ${newChannel.rateLimitPerUser} second(s)`);
	}

	if (oldChannel.videoQualityMode !== newChannel.videoQualityMode) {
		resultOld.push(`Video Quality: ${oldChannel.videoQualityMode == 1 ? "Auto" : "Full"}`);
		resultNew.push(`Video Quality: ${newChannel.videoQualityMode == 1 ? "Auto" : "Full"}`);
	}

	return { resultOld, resultNew };
};
