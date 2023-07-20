import { DependencyContainer } from "tsyringe";
import { Ilogger } from "@spt-aki/models/spt/utils/Ilogger";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ItemHelper } from "@spt-aki/helpers/ItemHelper";
import { BaseClasses } from  "@spt-aki/models/enums/BaseClasses";

class WeaponsAndAttachmentsCustomizer implements IPostDBLoadMod
{
	private generalGunsConfig = require("../config/generalGunsConfig.json");
	private silencersConfig = require("../config/silencersConfig.json");
	private scopesConfig = require("../config/scopesConfig.json");
	private specificGunsConfig = require("../config/specificGunsConfig.json");

	public adjustMultiplier(initial, multiplier)
	{
		initial = initial - 1;
		initial *= multiplier;
		return initial + 1;
	}

	public postDBLoad(container: DependencyContainer): void 
	{
		const logger = container.resolve<Ilogger>("WinstonLogger");
		const db = container.resolve<DatabaseServer>("DatabaseServer");
		const itemHelper = container.resolve<ItemHelper>("ItemHelper");
		const tables = db.getTables();    
		const itemDB = tables.templates.items;

		const updateGunsErgo = [
			this.generalGunsConfig.ergonomicsSection.useErgonomicsMultiplier,
			this.generalGunsConfig.ergonomicsSection.useErgonomicsAbsoluteValue,
			this.generalGunsConfig.ergonomicsSection.useMinimumErgonomicsValue
		].filter(Boolean).length;

		const updateGunsVerticalRecoil = [
			this.generalGunsConfig.verticalRecoilSection.useVerticalRecoilMultiplier,
			this.generalGunsConfig.verticalRecoilSection.useVerticalRecoilAbsoluteValue,
			this.generalGunsConfig.verticalRecoilSection.useMaximumVerticalRecoilValue
		].filter(Boolean).length;

		const updateGunsHorizontalRecoil = [
			this.generalGunsConfig.horizontalRecoilSection.useHorizontalRecoilMultiplier,
			this.generalGunsConfig.horizontalRecoilSection.useHorizontalRecoilAbsoluteValue,
			this.generalGunsConfig.horizontalRecoilSection.useMaximumHorizontalRecoilValue
		].filter(Boolean).length;

		const updateGunsCameraSnap = [
			this.generalGunsConfig.cameraSnapSection.useCameraSnapMultiplier,
			this.generalGunsConfig.cameraSnapSection.useCameraSnapAbsoluteValue,
			this.generalGunsConfig.cameraSnapSection.useMinimumCameraSnapValue
		].filter(Boolean).length;


		const updateGunsCameraRecoil = [
			this.generalGunsConfig.cameraRecoilSection.useCameraRecoilMultiplier,
			this.generalGunsConfig.cameraRecoilSection.useCameraRecoilAbsoluteValue,
			this.generalGunsConfig.cameraRecoilSection.useMaximumCameraRecoilValue
		].filter(Boolean).length;


		const updateGunsDurabilityBurn = [
			this.generalGunsConfig.durabilitySection.useDurabilityBurnMultiplier,
			this.generalGunsConfig.durabilitySection.useDurabilityBurnAbsoluteValue,
			this.generalGunsConfig.durabilitySection.useMaximumDurabilityBurnValue
		].filter(Boolean).length;


		const updateGunsFirerate = [
			this.generalGunsConfig.firerateSection.useFirerateMultiplier,
			this.generalGunsConfig.firerateSection.useFirerateAbsoluteValue,
			this.generalGunsConfig.firerateSection.useFirerateMinimumValue
		].filter(Boolean).length;

		const updateGunsFiremodes = [
			this.generalGunsConfig.firemodeSection.addFullAuto,
			this.generalGunsConfig.firemodeSection.removeBurst
		].filter(Boolean).length;

		const updateSilencersRecoil = [
			this.silencersConfig.recoilSection.useRecoilMultiplier,
			this.silencersConfig.recoilSection.useRecoilAbsoluteValue,
			this.silencersConfig.recoilSection.useMaximumRecoilValue
		].filter(Boolean).length;


		const updateSilencersLoudness = [
			this.silencersConfig.loudnessSection.useLoundnessMultiplier,
			this.silencersConfig.loudnessSection.useLoundnessAbsoluteValue,
			this.silencersConfig.loudnessSection.useMaximumLoundnessValue
		].filter(Boolean).length;


		const updateSilencersErgonomics = [
			this.silencersConfig.ergonomicsSection.useErgonomicsMultiplier,
			this.silencersConfig.ergonomicsSection.useErgonomicsAbsoluteValue,
			this.silencersConfig.ergonomicsSection.useMinimumErgonomicsValue
		].filter(Boolean).length;


		const updateSilencersVelocity = [
			this.silencersConfig.velocitySection.useVelocityMultiplier,
			this.silencersConfig.velocitySection.useVelocityAbsoluteValue,
			this.silencersConfig.velocitySection.useMinimumVelocityValue
		].filter(Boolean).length;


		const updateSilencersAccuracy = [
			this.silencersConfig.accuracySection.useAccuracyMultiplier,
			this.silencersConfig.accuracySection.useAccuracyAbsoluteValue,
			this.silencersConfig.accuracySection.useMinimumAccuracyValue
		].filter(Boolean).length;


		const updateSilencersDurabilityBurn = [
			this.silencersConfig.durabilityBurnSection.useDurabilityMultiplier,
			this.silencersConfig.durabilityBurnSection.useDurabilityAbsoluteValue,
			this.silencersConfig.durabilityBurnSection.useMaximumDurabilityValue
		].filter(Boolean).length;


		const updateSilencersHeat = [
			this.silencersConfig.heatSection.useHeatMultiplier,
			this.silencersConfig.heatSection.useHeatAbsoluteValue,
			this.silencersConfig.heatSection.useMaximumHeatValue
		].filter(Boolean).length;
		
		const updateSilencersCooling = [
			this.silencersConfig.coolingSection.useCoolingMultiplier,
			this.silencersConfig.coolingSection.useCoolingAbsoluteValue,
			this.silencersConfig.coolingSection.useMinimumCoolingValue
		].filter(Boolean).length;

		const updateScopesErgonomics = [
			this.scopesConfig.ergonomicsSection.useErgonomicsMultiplier,
			this.scopesConfig.ergonomicsSection.useErgonomicsAbsoluteValue,
			this.scopesConfig.ergonomicsSection.useMinimumErgonomicsValue
		].filter(Boolean).length;
		
		let gunsErgonomicsUpdates = 0, gunsVerticalRecoilUpdates = 0, gunsHorizontalRecoilUpdates = 0, gunsCameraSnapUpdates = 0, gunsCameraRecoilUpdates = 0, gunsDurabilityBurnUpdates = 0, gunsFirerateUpdates = 0, gunsFiremodeChanges = 0, silencerRecoilUpdates = 0, silencerLoudnessUpdates = 0, silencerErgonomicsUpdates = 0, silencerVelocityUpdates = 0, silencerAccuracyUpdates = 0, silencerDurabilityBurnUpdates = 0, silencerHeatUpdates = 0, silencerCoolingUpdates = 0, scopeErgonomicsUpdates = 0, specificGunsUpdates = 0;
		// do specific guns config
		for (let weaponGroup in this.specificGunsConfig) {
			for (let gun in this.specificGunsConfig[weaponGroup]) {
				try {
					let selectedGun = this.specificGunsConfig[weaponGroup][gun];
					let gunUpdated = false;
					if (itemDB[selectedGun.id]._props.hasOwnProperty("Ergonomics")) {
						if (selectedGun.ergonomicsAbsolute !== -1) {
							itemDB[selectedGun.id]._props.Ergonomics = selectedGun.ergonomicsAbsolute;
							gunUpdated = true;
						} else if (selectedGun.ergonomicsMultiplier !== 1) {
							itemDB[selectedGun.id]._props.Ergonomics *= selectedGun.ergonomicsMultiplier;
							gunUpdated = true;
						}
					}
					if (itemDB[selectedGun.id]._props.hasOwnProperty("RecoilForceUp")) {
						if (selectedGun.verticalRecoilAbsolute !== -1) {
							itemDB[selectedGun.id]._props.RecoilForceUp = selectedGun.verticalRecoilAbsolute;
							gunUpdated = true;
						} else if (selectedGun.verticalRecoilMultiplier !== 1) {
							itemDB[selectedGun.id]._props.RecoilForceUp *= selectedGun.verticalRecoilMultiplier;
							gunUpdated = true;
						}
					}
					if (itemDB[selectedGun.id]._props.hasOwnProperty("RecoilForceBack")) {
						if (selectedGun.horizontalRecoilAbsolute !== -1) {
							itemDB[selectedGun.id]._props.RecoilForceBack = selectedGun.horizontalRecoilAbsolute;
							gunUpdated = true;
						} else if (selectedGun.horizontalRecoilMultiplier !== 1) { 
							itemDB[selectedGun.id]._props.RecoilForceBack *= selectedGun.horizontalRecoilMultiplier;
							gunUpdated = true;
						}
					}
					if (itemDB[selectedGun.id]._props.hasOwnProperty("CameraSnap")) {
						if (selectedGun.cameraSnapAbsolute !== -1) {
							itemDB[selectedGun.id]._props.CameraSnap = selectedGun.cameraSnapAbsolute;
							gunUpdated = true;
						} else if (selectedGun.cameraSnapMultiplier !== 1){
							itemDB[selectedGun.id]._props.CameraSnap *= selectedGun.cameraSnapMultiplier;
 							gunUpdated = true;
						}
					}
					if (itemDB[selectedGun.id]._props.hasOwnProperty("CameraRecoil")) {
						if (selectedGun.cameraRecoilAbsolute !== -1) {
							itemDB[selectedGun.id]._props.CameraRecoil = selectedGun.cameraRecoilAbsolute;
							gunUpdated = true;
						} else if (selectedGun.cameraRecoilMultiplier !== 1) {
							itemDB[selectedGun.id]._props.CameraRecoil *= selectedGun.cameraRecoilMultiplier;
							gunUpdated = true;
						}
					}
					if (gunUpdated) {
						specificGunsUpdates++;
					}
				} catch(err) {
					logger.info("[WeaponsAndAttachmentsCustomizer] failed to update specific weapon with id " + this.specificGunsConfig[weaponGroup][gun].id);
					continue;
				}
			}
		}
		// do general guns config
		for (let item in itemDB) {
			// if it's weapon that's not a knife
			if (itemHelper.isOfBaseclass(itemDB[item]._id, BaseClasses.WEAPON)) {
				try {
					// Ergonomics
					if (updateGunsErgo === 1 && itemDB[item]._props.hasOwnProperty("Ergonomics")) {
						if (this.generalGunsConfig.ergonomicsSection.useErgonomicsMultiplier) {
							itemDB[item]._props.Ergonomics *= this.generalGunsConfig.ergonomicsSection.ergonomicsMultiplier;
						} else if (this.generalGunsConfig.ergonomicsSection.useErgonomicsAbsoluteValue) {
							itemDB[item]._props.Ergonomics = this.generalGunsConfig.ergonomicsSection.ergonomicsAbsoluteValue;
						} else if (itemDB[item]._props.Ergonomics < this.generalGunsConfig.ergonomicsSection.minimumErgonomicsValue) {
							itemDB[item]._props.Ergonomics = this.generalGunsConfig.ergonomicsSection.minimumErgonomicsValue;
						}
						gunsErgonomicsUpdates++;
					}
					// Vertical Recoil
					if (updateGunsVerticalRecoil === 1 && itemDB[item]._props.hasOwnProperty("RecoilForceUp")) {
						if (this.generalGunsConfig.verticalRecoilSection.useVerticalRecoilMultiplier) {
							itemDB[item]._props.RecoilForceUp *= this.generalGunsConfig.verticalRecoilSection.verticalRecoilMultiplier;
						} else if (this.generalGunsConfig.verticalRecoilSection.useVerticalRecoilAbsoluteValue) {
							itemDB[item]._props.RecoilForceUp = this.generalGunsConfig.verticalRecoilSection.verticalRecoilAbsoluteValue;
						} else if (itemDB[item]._props.RecoilForceUp > this.generalGunsConfig.verticalRecoilSection.maximumVerticalRecoilValue) {
							itemDB[item]._props.RecoilForceUp = this.generalGunsConfig.verticalRecoilSection.maximumVerticalRecoilValue;
						}
						gunsVerticalRecoilUpdates++;
					}
					// Horizontal Recoil
					if (updateGunsHorizontalRecoil === 1 && itemDB[item]._props.hasOwnProperty("RecoilForceBack")) {
						if (this.generalGunsConfig.horizontalRecoilSection.useHorizontalRecoilMultiplier) {
							itemDB[item]._props.RecoilForceBack *= this.generalGunsConfig.horizontalRecoilSection.horizontalRecoilMultiplier;
						} else if (this.generalGunsConfig.horizontalRecoilSection.useHorizontalRecoilAbsoluteValue) {
							itemDB[item]._props.RecoilForceBack = this.generalGunsConfig.horizontalRecoilSection.horizontalRecoilAbsoluteValue;
						} else if (itemDB[item]._props.RecoilForceBack > this.generalGunsConfig.horizontalRecoilSection.maximumHorizontalRecoilValue) {
							itemDB[item]._props.RecoilForceBack = this.generalGunsConfig.horizontalRecoilSection.maximumHorizontalRecoilValue;
						}
						gunsHorizontalRecoilUpdates++;
					}

					// Camera Snap
					if (updateGunsCameraSnap === 1 && itemDB[item]._props.hasOwnProperty("CameraSnap")) {
						if (this.generalGunsConfig.cameraSnapSection.useCameraSnapMultiplier) {
							itemDB[item]._props.CameraSnap *= this.generalGunsConfig.cameraSnapSection.cameraSnapMultiplier;
						} else if (this.generalGunsConfig.cameraSnapSection.useCameraSnapAbsoluteValue) {
							itemDB[item]._props.CameraSnap = this.generalGunsConfig.cameraSnapSection.cameraSnapAbsoluteValue;
						} else if (itemDB[item]._props.CameraSnap < this.generalGunsConfig.cameraSnapSection.minimumCameraSnapValue) {
							itemDB[item]._props.CameraSnap = this.generalGunsConfig.cameraSnapSection.minimumCameraSnapValue;
						}
						gunsCameraSnapUpdates++;
					}

					// Camera Recoil
					if (updateGunsCameraRecoil === 1 && itemDB[item]._props.hasOwnProperty("CameraRecoil")) {
						if (this.generalGunsConfig.cameraRecoilSection.useCameraRecoilMultiplier) {
							itemDB[item]._props.CameraRecoil *= this.generalGunsConfig.cameraRecoilSection.cameraRecoilMultiplier;
						} else if (this.generalGunsConfig.cameraRecoilSection.useCameraRecoilAbsoluteValue) {
							itemDB[item]._props.CameraRecoil = this.generalGunsConfig.cameraRecoilSection.cameraRecoilAbsoluteValue;
						} else if (itemDB[item]._props.CameraRecoil > this.generalGunsConfig.cameraRecoilSection.maximumCameraRecoilValue) {
							itemDB[item]._props.CameraRecoil = this.generalGunsConfig.cameraRecoilSection.maximumCameraRecoilValue;
						}
						gunsCameraRecoilUpdates++;
					}

					// Durability Burn
					if (updateGunsDurabilityBurn === 1 && itemDB[item]._props.hasOwnProperty("DurabilityBurnRatio")) {
						if (this.generalGunsConfig.durabilitySection.useDurabilityBurnMultiplier) {
							itemDB[item]._props.DurabilityBurnRatio *= this.generalGunsConfig.durabilitySection.durabilityBurnMultiplier;
						} else if (this.generalGunsConfig.durabilitySection.useDurabilityBurnAbsoluteValue) {
							itemDB[item]._props.DurabilityBurnRatio = this.generalGunsConfig.durabilitySection.durabilityBurnAbsoluteValue;
						} else if (itemDB[item]._props.DurabilityBurnRatio > this.generalGunsConfig.durabilitySection.maximumDurabilityBurnValue) {
							itemDB[item]._props.DurabilityBurnRatio = this.generalGunsConfig.durabilitySection.maximumDurabilityBurnValue;
						}
						gunsDurabilityBurnUpdates++;
					}

					// Firerate
					if (updateGunsFirerate === 1 && itemDB[item]._props.hasOwnProperty("bFirerate")) {
						if (this.generalGunsConfig.firerateSection.useFirerateMultiplier) {
							itemDB[item]._props.bFirerate *= this.generalGunsConfig.firerateSection.firerateMultiplier;
						} else if (this.generalGunsConfig.firerateSection.useFirerateAbsoluteValue) {
							itemDB[item]._props.bFirerate = this.generalGunsConfig.firerateSection.firerateAbsoluteValue;
						} else if (itemDB[item]._props.bFirerate < this.generalGunsConfig.firerateSection.minimumFirerateValue) {
							itemDB[item]._props.bFirerate = this.generalGunsConfig.firerateSection.minimumFirerateValue;
						}
						gunsFirerateUpdates++;
					}

					//Firemodes
					if (updateGunsFiremodes !== 0 && itemDB[item]._props.hasOwnProperty("weapFireType")) {
						if (this.generalGunsConfig.firemodeSection.addFullAuto) {
							if (itemHelper.isOfBaseclass(itemDB[item]._id, BaseClasses.SMG) && this.generalGunsConfig.firemodeSection.addToSMG && !itemDB[item]._props.weapFireType.includes("fullauto")) {
								itemDB[item]._props.weapFireType.push("fullauto");
								gunsFiremodeChanges++;
							}
						}
						if (this.generalGunsConfig.firemodeSection.removeBurst) {
							if (itemHelper.isOfBaseclass(itemDB[item]._id, BaseClasses.SMG) && this.generalGunsConfig.firemodeSection.removeFromSMG && itemDB[item]._props.weapFireType.includes("burst")) {
								itemDB[item]._props.weapFireType = itemDB[item]._props.weapFireType.filter((str) => str !== "burst");
								gunsFiremodeChanges++;
							}
							if (itemHelper.isOfBaseclass(itemDB[item]._id, BaseClasses.ASSAULT_RIFLE) && this.generalGunsConfig.firemodeSection.removeFromAssaultRifles && itemDB[item]._props.weapFireType.includes("burst")) {
								itemDB[item]._props.weapFireType = itemDB[item]._props.weapFireType.filter((str) => str !== "burst");
								gunsFiremodeChanges++;
							}
						}						
					}
				} catch(err) {
					logger.info("[WeaponsAndAttachmentsCustomizer] failed to update weapon with id " + itemDB[item]._id);
					continue;
				}
			}
			// if it's a silencer
			if (itemDB[item]._parent === "550aa4cd4bdc2dd8348b456c") {
				try {
					// Recoil
					if (updateSilencersRecoil === 1 && itemDB[item]._props.hasOwnProperty("Recoil")) {
						if (this.silencersConfig.recoilSection.useRecoilMultiplier) {
							itemDB[item]._props.Recoil *= this.silencersConfig.recoilSection.recoilMultiplier;
						} else if (this.silencersConfig.recoilSection.useRecoilAbsoluteValue) {
							itemDB[item]._props.Recoil = this.silencersConfig.recoilSection.recoilAbsoluteValue;
						} else if (itemDB[item]._props.Recoil > this.silencersConfig.recoilSection.maximumRecoilValue) {
							itemDB[item]._props.Recoil = this.silencersConfig.recoilSection.maximumRecoilValue;
						}
						silencerRecoilUpdates++;
					}
					// Loudness
					if (updateSilencersLoudness === 1 && itemDB[item]._props.hasOwnProperty("Loudness")) {
						if (this.silencersConfig.loudnessSection.useLoundnessMultiplier) {
							itemDB[item]._props.Loudness *= this.silencersConfig.loudnessSection.loundnessMultiplier;
						} else if (this.silencersConfig.loudnessSection.useLoundnessAbsoluteValue) {
							itemDB[item]._props.Loudness = this.silencersConfig.loudnessSection.loundnessAbsoluteValue;
						} else if (itemDB[item]._props.Loudness > this.silencersConfig.loudnessSection.maximumLoundnessValue) {
							itemDB[item]._props.Loudness = this.silencersConfig.loudnessSection.maximumLoundnessValue;
						}
						silencerLoudnessUpdates++;
					}
					// Ergonomics
					if (updateSilencersErgonomics === 1 && itemDB[item]._props.hasOwnProperty("Ergonomics")) {
						if (this.silencersConfig.ergonomicsSection.useErgonomicsMultiplier) {
							itemDB[item]._props.Ergonomics *= this.silencersConfig.ergonomicsSection.ergonomicsMultiplier;
						} else if (this.silencersConfig.ergonomicsSection.useErgonomicsAbsoluteValue) {
							itemDB[item]._props.Ergonomics = this.silencersConfig.ergonomicsSection.ergonomicsAbsoluteValue;
						} else if (itemDB[item]._props.Ergonomics < this.silencersConfig.ergonomicsSection.minimumErgonomicsValue) {
							itemDB[item]._props.Ergonomics = this.silencersConfig.ergonomicsSection.minimumErgonomicsValue;
						}
						silencerErgonomicsUpdates++;
					}
					// Muzzle velocity
					if (updateSilencersVelocity === 1 && itemDB[item]._props.hasOwnProperty("Velocity")) {
						if (this.silencersConfig.velocitySection.useVelocityMultiplier) {
							if (itemDB[item]._props.Velocity > 0) {
								itemDB[item]._props.Velocity *= this.silencersConfig.velocitySection.velocityMultiplierForPositiveBaseVelocity;
							} else {
								itemDB[item]._props.Velocity *= this.silencersConfig.velocitySection.velocityMultiplierForNegativeBaseVelocity;
							}
						} else if (this.silencersConfig.velocitySection.useVelocityAbsoluteValue) {
							itemDB[item]._props.Velocity = this.silencersConfig.velocitySection.velocityAbsoluteValue;
						} else if (itemDB[item]._props.Velocity < this.silencersConfig.velocitySection.minimumVelocityValue) {
							itemDB[item]._props.Velocity = this.silencersConfig.velocitySection.minimumVelocityValue;
						}
						silencerVelocityUpdates++;
					}
					// Accuracy
					if (updateSilencersAccuracy === 1 && itemDB[item]._props.hasOwnProperty("Accuracy")) {
						if (this.silencersConfig.accuracySection.useAccuracyMultiplier) {
							if (itemDB[item]._props.Velocity > 0) {
								itemDB[item]._props.Velocity *= this.silencersConfig.accuracySection.accuracyMultiplierForPositiveBaseAccuracy;
							} else {
								itemDB[item]._props.Velocity *= this.silencersConfig.accuracySection.accuracyMultiplierForNegativeBaseAccuracy;
							}
						} else if (this.silencersConfig.accuracySection.useAccuracyAbsoluteValue) {
							itemDB[item]._props.Velocity = this.silencersConfig.accuracySection.accuracyAbsoluteValue;
						} else if (itemDB[item]._props.Velocity < this.silencersConfig.accuracySection.minimumAccuracyValue) {
							itemDB[item]._props.Velocity = this.silencersConfig.accuracySection.minimumAccuracyValue;
						}
						silencerAccuracyUpdates++;
					}
					// Durability Burn
					if (updateSilencersDurabilityBurn === 1 && itemDB[item]._props.hasOwnProperty("DurabilityBurnModificator")) {
						if (this.silencersConfig.durabilityBurnSection.useDurabilityMultiplier) {
							itemDB[item]._props.DurabilityBurnModificator = this.adjustMultiplier(itemDB[item]._props.DurabilityBurnModificator, this.silencersConfig.durabilityBurnSection.durabilityBurnMultiplier);
						} else if (this.silencersConfig.durabilityBurnSection.useDurabilityAbsoluteValue) {
							itemDB[item]._props.DurabilityBurnModificator = this.silencersConfig.durabilityBurnSection.durabilityBurnAbsoluteValue;
						} else if (itemDB[item]._props.DurabilityBurnModificator < this.silencersConfig.durabilityBurnSection.maximumDurabilityBurnValue) {
							itemDB[item]._props.DurabilityBurnModificator = this.silencersConfig.durabilityBurnSection.maximumDurabilityBurnValue;
						}
						silencerDurabilityBurnUpdates++;
					}
					// Heat
					if (updateSilencersHeat === 1 && itemDB[item]._props.hasOwnProperty("HeatFactor")) {
						if (this.silencersConfig.heatSection.useHeatMultiplier) {
							itemDB[item]._props.HeatFactor = this.adjustMultiplier(itemDB[item]._props.HeatFactor, this.silencersConfig.heatSection.heatMultiplier);
						} else if (this.silencersConfig.heatSection.useHeatAbsoluteValue) {
							itemDB[item]._props.HeatFactor = this.silencersConfig.heatSection.heatAbsoluteValue;
						} else if (itemDB[item]._props.HeatFactor < this.silencersConfig.heatSection.maximumHeatValue) {
							itemDB[item]._props.HeatFactor = this.silencersConfig.heatSection.maximumHeatValue;
						}
						silencerHeatUpdates++;
					}
					// Cooling
					if (updateSilencersCooling === 1 && itemDB[item]._props.hasOwnProperty("CoolFactor")) {
						if (this.silencersConfig.coolingSection.useCoolingMultiplier) {
							itemDB[item]._props.CoolFactor = this.adjustMultiplier(itemDB[item]._props.CoolFactor, this.silencersConfig.coolingSection.coolingMultiplier);
						} else if (this.silencersConfig.coolingSection.useCoolingAbsoluteValue) {
							itemDB[item]._props.CoolFactor = this.silencersConfig.coolingSection.coolingAbsoluteValue;
						} else if (itemDB[item]._props.CoolFactor < this.silencersConfig.coolingSection.minimumCoolingValue) {
							itemDB[item]._props.CoolFactor = this.silencersConfig.coolingSection.minimumCoolingValue;
						}
						silencerCoolingUpdates++;
					}
				} catch(err) {
					logger.info("[WeaponsAndAttachmentsCustomizer] failed to update silencer with id " + itemDB[item]._id);
					continue;
				}
			}
			// if it's a sight
			if (itemHelper.isOfBaseclass(itemDB[item]._id, BaseClasses.SIGHTS)) {
				try {
					// Ergonomics
					if (updateScopesErgonomics === 1 && itemDB[item]._props.hasOwnProperty("Ergonomics")) {
						if (this.scopesConfig.ergonomicsSection.useErgonomicsMultiplier) {
							if (itemDB[item]._props.Ergonomics > 0) {
								itemDB[item]._props.Ergonomics *= this.scopesConfig.ergonomicsSection.ergonomicsMultiplierForPositiveBaseErgonomics;
							} else {
								itemDB[item]._props.Ergonomics *= this.scopesConfig.ergonomicsSection.ergonomicsMultiplierForNegativeBaseErgonomics;
							}
						} else if (this.scopesConfig.ergonomicsSection.useErgonomicsAbsoluteValue) {
							itemDB[item]._props.Ergonomics = this.scopesConfig.ergonomicsSection.ergonomicsAbsoluteValue;
						} else if (itemDB[item]._props.Ergonomics < this.scopesConfig.ergonomicsSection.minimumErgonomicsValue) {
							itemDB[item]._props.Ergonomics = this.scopesConfig.ergonomicsSection.minimumErgonomicsValue;
						}
						scopeErgonomicsUpdates++;
					}
				} catch(err) {
					logger.info("[WeaponsAndAttachmentsCustomizer] failed to update sight with id " + itemDB[item]._id);
					continue;
				}
			}
		}
		
		logger.info("[WeaponsAndAttachmentsCustomizer] MusicManiac - WeaponsAndAttachmentsCustomizer Loaded:");
		if (specificGunsUpdates === 0) {
			logger.info("[WeaponsAndAttachmentsCustomizer] specificGunsConfig.json is not touched, no specific guns will be updated");
		} else {
			logger.info("[WeaponsAndAttachmentsCustomizer] " + specificGunsUpdates + " weapons from specificGunsConfig.json had their stats adjusted");
		}
		if (updateGunsErgo === 0) {
			logger.info("[WeaponsAndAttachmentsCustomizer] All guns ergonomics options are disabled, no guns will be updated");
		  } else if (updateGunsErgo > 1) {
			logger.info("[WeaponsAndAttachmentsCustomizer] More than 1 guns ergonomics options are enabled, no guns will be updated");
		} else {
			logger.info("[WeaponsAndAttachmentsCustomizer] " + gunsErgonomicsUpdates + " weapons had their ergonomics adjusted");
		}
		
		if (updateGunsVerticalRecoil === 0) {
			logger.info("[WeaponsAndAttachmentsCustomizer] All guns vertical recoil options are disabled, no guns will be updated");
		} else if (updateGunsVerticalRecoil > 1) {
			logger.info("[WeaponsAndAttachmentsCustomizer] More than 1 guns vertical recoil options are enabled, no guns will be updated");
		} else {
			logger.info("[WeaponsAndAttachmentsCustomizer] " + gunsVerticalRecoilUpdates + " weapons had their vertical recoil adjusted");
		}
		
		if (updateGunsHorizontalRecoil === 0) {
			logger.info("[WeaponsAndAttachmentsCustomizer] All guns horizontal recoil options are disabled, no guns will be updated");
		} else if (updateGunsHorizontalRecoil > 1) {
			logger.info("[WeaponsAndAttachmentsCustomizer] More than 1 guns horizontal recoil options are enabled, no guns will be updated");
		} else {
			logger.info("[WeaponsAndAttachmentsCustomizer] " + gunsHorizontalRecoilUpdates + " weapons had their horizontal recoil adjusted");
		}
		
		if (updateGunsCameraSnap === 0) {
			logger.info("[WeaponsAndAttachmentsCustomizer] All guns camera snap options are disabled, no guns will be updated");
		} else if (updateGunsCameraSnap > 1) {
			logger.info("[WeaponsAndAttachmentsCustomizer] More than 1 guns camera snap options are enabled, no guns will be updated");
		} else {
			logger.info("[WeaponsAndAttachmentsCustomizer] " + gunsCameraSnapUpdates + " weapons had their camera snap adjusted");
		}
		
		if (updateGunsCameraRecoil === 0) {
			logger.info("[WeaponsAndAttachmentsCustomizer] All guns camera recoil options are disabled, no guns will be updated");
		} else if (updateGunsCameraRecoil > 1) {
			logger.info("[WeaponsAndAttachmentsCustomizer] More than 1 guns camera recoil options are enabled, no guns will be updated");
		} else {
			logger.info("[WeaponsAndAttachmentsCustomizer] " + gunsCameraRecoilUpdates + " weapons had their camera recoil adjusted");
		}
		
		if (updateGunsDurabilityBurn === 0) {
			logger.info("[WeaponsAndAttachmentsCustomizer] All guns durability burn options are disabled, no guns will be updated");
		} else if (updateGunsDurabilityBurn > 1) {
			logger.info("[WeaponsAndAttachmentsCustomizer] More than 1 guns durability burn options are enabled, no guns will be updated");
		} else {
			logger.info("[WeaponsAndAttachmentsCustomizer] " + gunsDurabilityBurnUpdates + " weapons had their durability burn adjusted");
		}
		
		if (updateGunsFirerate === 0) {
			logger.info("[WeaponsAndAttachmentsCustomizer] All guns firerate options are disabled, no guns will be updated");
		} else if (updateGunsFirerate > 1) {
			logger.info("[WeaponsAndAttachmentsCustomizer] More than 1 guns firerate options are enabled, no guns will be updated");
		} else {
			logger.info("[WeaponsAndAttachmentsCustomizer] " + gunsFirerateUpdates + " weapons had their firerate adjusted");
		}

		if (updateGunsFiremodes === 0) {
			logger.info("[WeaponsAndAttachmentsCustomizer] All guns firemode options are disabled, no guns will be updated");
		} else {
			logger.info("[WeaponsAndAttachmentsCustomizer] " + gunsFiremodeChanges + " weapons had their firemode adjusted");
		}

		if (updateSilencersRecoil === 0) {
			logger.info("[WeaponsAndAttachmentsCustomizer] All silencers recoil options are disabled, no silencers will be updated");
		} else if (updateSilencersRecoil > 1) {
			logger.info("[WeaponsAndAttachmentsCustomizer] More than 1 silencers recoil options are enabled, no silencers will be updated");
		} else {
			logger.info("[WeaponsAndAttachmentsCustomizer] " + silencerRecoilUpdates + " silencers had their recoil adjusted");
		}
		
		if (updateSilencersLoudness === 0) {
			logger.info("[WeaponsAndAttachmentsCustomizer] All silencers loudness options are disabled, no silencers will be updated");
		} else if (updateSilencersLoudness > 1) {
			logger.info("[WeaponsAndAttachmentsCustomizer] More than 1 silencers loudness options are enabled, no silencers will be updated");
		} else {
			logger.info("[WeaponsAndAttachmentsCustomizer] " + silencerLoudnessUpdates + " silencers had their loudness adjusted");
		}
		
		if (updateSilencersErgonomics === 0) {
			logger.info("[WeaponsAndAttachmentsCustomizer] All silencers ergonomics options are disabled, no silencers will be updated");
		} else if (updateSilencersErgonomics > 1) {
			logger.info("[WeaponsAndAttachmentsCustomizer] More than 1 silencers ergonomics options are enabled, no silencers will be updated");
		} else {
			logger.info("[WeaponsAndAttachmentsCustomizer] " + silencerErgonomicsUpdates + " silencers had their ergonomics adjusted");
		}
		
		if (updateSilencersVelocity === 0) {
			logger.info("[WeaponsAndAttachmentsCustomizer] All silencers muzzle velocity options are disabled, no silencers will be updated");
		} else if (updateSilencersVelocity > 1) {
			logger.info("[WeaponsAndAttachmentsCustomizer] More than 1 silencers muzzle velocity options are enabled, no silencers will be updated");
		} else {
			logger.info("[WeaponsAndAttachmentsCustomizer] " + silencerVelocityUpdates + " silencers had their muzzle velocity adjusted");
		}
		
		if (updateSilencersAccuracy === 0) {
			logger.info("[WeaponsAndAttachmentsCustomizer] All silencers accuracy options are disabled, no silencers will be updated");
		} else if (updateSilencersAccuracy > 1) {
			logger.info("[WeaponsAndAttachmentsCustomizer] More than 1 silencers accuracy options are enabled, no silencers will be updated");
		} else {
			logger.info("[WeaponsAndAttachmentsCustomizer] " + silencerAccuracyUpdates + " silencers had their accuracy adjusted");
		}
		
		if (updateSilencersDurabilityBurn === 0) {
			logger.info("[WeaponsAndAttachmentsCustomizer] All silencers durability burn options are disabled, no silencers will be updated");
		} else if (updateSilencersDurabilityBurn > 1) {
			logger.info("[WeaponsAndAttachmentsCustomizer] More than 1 silencers durability burn options are enabled, no silencers will be updated");
		} else {
			logger.info("[WeaponsAndAttachmentsCustomizer] " + silencerDurabilityBurnUpdates + " silencers had their durability burn adjusted");
		}

		if (updateScopesErgonomics === 0) {
			logger.info("[WeaponsAndAttachmentsCustomizer] All silencers cooling options are disabled, no silencers will be updated");
		} else if (updateScopesErgonomics > 1) {
			logger.info("[WeaponsAndAttachmentsCustomizer] More than 1 silencers cooling options are enabled, no silencers will be updated");
		} else {
			logger.info("[WeaponsAndAttachmentsCustomizer] " + scopeErgonomicsUpdates + " scopes had their ergonomics adjusted");
		}
		
	}
}

module.exports = { mod: new WeaponsAndAttachmentsCustomizer() }