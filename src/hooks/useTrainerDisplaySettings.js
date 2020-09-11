import create from 'zustand';

const useTrainerDisplaySettings = create((set) => ({
  skillSearchTypeAnd: false,
  searchSkillOnlyInActiveUpgrade: false,
  toggle: (key) => set((state) => ({ [key]: !state.key })),
  setState: (key, value) => set(() => ({ [key]: value })),
  sortBy: { type: ['rarity', 'alphabet'], order: 'asc' },
}));

export default useTrainerDisplaySettings;

const getSearchSkillOnlyInActiveUpgrade = (state) =>
  state.searchSkillOnlyInActiveUpgrade;

export { getSearchSkillOnlyInActiveUpgrade };
