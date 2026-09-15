// Shared Fanatics/Impact affiliate link builder for Lettermen Rack.
// Reused by index.html (picker) and the /schools/... SEO landing pages.
(function(global){
  function buildAffiliateLink(schoolName, schoolNickname, sport, category){
    const parts = [schoolName, schoolNickname, sport, category].filter(Boolean);
    const query = parts.join(' ');
    const destination = `https://www.fanatics.com/?query=${query}&_ref=p-SRP:m-SEARCH`;
    const encodedDestination = encodeURIComponent(destination);
    return `https://fanatics.93n6tx.net/c/7628239/586570/9663?u=${encodedDestination}&partnerpropertyid=8735497&MediaPartnerPropertyId=8735497`;
  }
  global.buildAffiliateLink = buildAffiliateLink;
})(window);
