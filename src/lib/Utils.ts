
export default class Utils {
    public static getRaceKey(raceDetails) {
        return `${raceDetails.raceName}:${raceDetails.raceDate}`;
    }
}