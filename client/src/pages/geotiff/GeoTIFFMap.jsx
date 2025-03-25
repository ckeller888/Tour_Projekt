import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { cogProtocol } from "@geomatico/maplibre-cog-protocol";

function GeoTIFFMap({ opacity }) {
  const mapRef = useRef();

  // initialize map on first render
  useEffect(() => {
    if (mapRef.current) return;
    mapRef.current = new maplibregl.Map({
      container: "geotiff-map-container", // html container id
      style: "https://geoserveis.icgc.cat/contextmaps/icgc_mapa_base_gris_simplificat.json", //stylesheet location
      center: [1.83369, 41.5937], // starting position
      zoom: 15.5, // starting zoom
    });
    maplibregl.addProtocol("cog", cogProtocol);
    mapRef.current.once("load", () => {
      mapRef.current.addSource("geotiff", {
        type: "raster",
        url: "cog://https://labs.geomatico.es/maplibre-cog-protocol/data/image.tif",
        tileSize: 256,
      });
      mapRef.current.addLayer({
        id: "geotiff-layer",
        type: "raster",
        source: "geotiff",
        paint: { "raster-opacity": opacity },
      });
    });
  }, [opacity]);

  // update GeoTIFF opacity when it changes
  useEffect(() => {
    if (mapRef.current && mapRef.current.getLayer("geotiff-layer")) {
      mapRef.current.setPaintProperty("geotiff-layer", "raster-opacity", opacity);
    }
  }, [opacity]);

  return <div id="geotiff-map-container" />;
}

export default GeoTIFFMap;
