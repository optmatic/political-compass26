declare module "vanta/dist/vanta.waves.min" {
  type VantaEffect = { destroy: () => void };

  type VantaWavesFactory = (options: Record<string, unknown>) => VantaEffect;

  const WAVES: VantaWavesFactory;
  export default WAVES;
}

declare module "vanta/dist/vanta.topology.min" {
  type VantaEffect = { destroy: () => void };

  type VantaTopologyFactory = (options: Record<string, unknown>) => VantaEffect;

  const TOPOLOGY: VantaTopologyFactory;
  export default TOPOLOGY;
}
