export var Frequency;
(function (Frequency) {
    Frequency[Frequency["YEARLY"] = 0] = "YEARLY";
    Frequency[Frequency["MONTHLY"] = 1] = "MONTHLY";
    Frequency[Frequency["WEEKLY"] = 2] = "WEEKLY";
    Frequency[Frequency["DAILY"] = 3] = "DAILY";
    Frequency[Frequency["HOURLY"] = 4] = "HOURLY";
    Frequency[Frequency["MINUTELY"] = 5] = "MINUTELY";
    Frequency[Frequency["SECONDLY"] = 6] = "SECONDLY";
})(Frequency || (Frequency = {}));
export function freqIsDailyOrGreater(freq) {
    return freq < Frequency.HOURLY;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBZ0JBLE1BQU0sQ0FBTixJQUFZLFNBUVg7QUFSRCxXQUFZLFNBQVM7SUFDbkIsNkNBQVUsQ0FBQTtJQUNWLCtDQUFXLENBQUE7SUFDWCw2Q0FBVSxDQUFBO0lBQ1YsMkNBQVMsQ0FBQTtJQUNULDZDQUFVLENBQUE7SUFDVixpREFBWSxDQUFBO0lBQ1osaURBQVksQ0FBQTtBQUNkLENBQUMsRUFSVyxTQUFTLEtBQVQsU0FBUyxRQVFwQjtBQUVELE1BQU0sVUFBVSxvQkFBb0IsQ0FDbEMsSUFBZTtJQU1mLE9BQU8sSUFBSSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUE7QUFDaEMsQ0FBQyJ9