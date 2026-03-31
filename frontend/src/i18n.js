import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "tracking_id": "Electronic Tracking ID",
      "status": "Shipment Status",
      "courier_verified": "Courier Verified",
      "estimated_delivery": "Est. Delivery",
      "hold_notice": "OFFICIAL CUSTOMS HOLD NOTICE",
      "hold_desc": "This consignment is currently being held by Customs Officials. A clearance fee is required.",
      "download_waybill": "Download Waybill",
      "sender_info": "Sender Info",
      "receiver_info": "Consignee Info",
      "weight": "Weight",
      "origin": "Origin Terminal",
      "destination": "Final Destination",
      "payment_summary": "Financial Ledger",
      "history": "Shipment History",
      "pay_fees": "Settle Customs Fees",
      "verify": "Verify Courier"
    }
  },
  fr: {
    translation: {
      "tracking_id": "Identifiant de Suivi Électronique",
      "status": "État de l'expédition",
      "courier_verified": "Courrier Vérifié",
      "estimated_delivery": "Livraison Prévue",
      "hold_notice": "AVIS DE RETENTION DOUANIÈRE",
      "hold_desc": "Cet envoi est actuellement retenu par les autorités douanières. Des frais de dédouanement sont requis.",
      "download_waybill": "Télécharger la Lettre de Transport",
      "sender_info": "Infos Expéditeur",
      "receiver_info": "Infos Destinataire",
      "weight": "Poids",
      "origin": "Terminal d'Origine",
      "destination": "Destination Finale",
      "payment_summary": "Grand Livre Financier",
      "history": "Historique des Mouvements",
      "pay_fees": "Payer les Frais de Douane",
      "verify": "Vérifier le Service"
    }
  },
  es: {
    translation: {
      "tracking_id": "ID de Seguimiento Electrónico",
      "status": "Estado del Envío",
      "courier_verified": "Courier Verificado",
      "estimated_delivery": "Entrega Estimada",
      "hold_notice": "AVISO DE RETENCIÓN ADUANERA",
      "hold_desc": "Este envío está retenido por funcionarios de aduanas. Se requieren cargos de despacho.",
      "download_waybill": "Descargar Guía de Carga",
      "sender_info": "Info del Remitente",
      "receiver_info": "Info del Consignatario",
      "weight": "Peso",
      "origin": "Terminal de Origen",
      "destination": "Destino Final",
      "payment_summary": "Libro Mayor Financiero",
      "history": "Historial de Envíos",
      "pay_fees": "Pagar Cargos de Aduana",
      "verify": "Verificar Mensajería"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
