export const simulatorConfig = {
  // Office hours boundaries (9:00 AM to 5:00 PM)
  officeStartHour: 9,
  officeEndHour: 17,
  
  // Probability baseline of a device being ON during office hours (0.8 = 80%)
  officeHoursOnProbability: 0.8,
  
  // Probability baseline of a device being ON after hours (0.1 = 10%)
  afterHoursOnProbability: 0.1,
  
  // Power Tariff Rate (BDT/kWh)
  tariffRate: 12,
};
