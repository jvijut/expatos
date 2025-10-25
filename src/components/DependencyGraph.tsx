"use client";

import { DocumentDependency } from "@/lib/ai/analyzeDependencies";
import { mockDocuments, type Document } from "@/lib/mockData";
import { useState } from "react";

interface DependencyGraphProps {
  dependencies: DocumentDependency[];
  documents: Document[];
}

interface NodePosition {
  top: string;
  left: string;
  transform: string;
}

export function DependencyGraph({ dependencies, documents }: DependencyGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Get document emoji
  const getDocumentEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      'passport': '🛂',
      'uae_visa': '📋',
      'emirates_id': '🆔',
      'ejari': '🏠',
      'health_insurance': '🏥'
    };
    return emojis[type] || '📄';
  };

  // Get document type name
  const getDocumentTypeName = (type: string) => {
    const names: Record<string, string> = {
      'passport': 'Passport',
      'uae_visa': 'UAE Visa',
      'emirates_id': 'Emirates ID',
      'ejari': 'Ejari',
      'health_insurance': 'Health Insurance'
    };
    return names[type] || type;
  };

  // Get document status
  const getDocumentStatus = (doc: Document) => {
    const today = new Date();
    const expiry = new Date(doc.expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'expired';
    if (diffDays <= 90) return 'warning';
    return 'valid';
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'expired': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Get dependency status for connections
  const getDependencyStatus = (parent: string, requires: string) => {
    const dep = dependencies.find(d => d.parent === parent && d.requires === requires);
    return dep ? dep.status : 'ok';
  };

  // Get connection line styling
  const getConnectionStyle = (status: string) => {
    switch (status) {
      case 'failing':
        return {
          borderColor: '#dc2626',
          borderWidth: '4px',
          borderStyle: 'solid',
          opacity: 1
        };
      case 'warning':
        return {
          borderColor: '#d97706',
          borderWidth: '2px',
          borderStyle: 'dashed',
          opacity: 0.8
        };
      case 'ok':
        return {
          borderColor: '#16a34a',
          borderWidth: '2px',
          borderStyle: 'solid',
          opacity: 0.6
        };
      default:
        return {
          borderColor: '#6b7280',
          borderWidth: '1px',
          borderStyle: 'solid',
          opacity: 0.4
        };
    }
  };

  // Node positions
  const nodePositions: Record<string, NodePosition> = {
    'uae_visa': {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    },
    'passport': {
      top: '20%',
      left: '25%',
      transform: 'translate(-50%, -50%)'
    },
    'health_insurance': {
      top: '20%',
      left: '75%',
      transform: 'translate(-50%, -50%)'
    },
    'ejari': {
      top: '80%',
      left: '25%',
      transform: 'translate(-50%, -50%)'
    },
    'emirates_id': {
      top: '80%',
      left: '75%',
      transform: 'translate(-50%, -50%)'
    }
  };

  // Get document by type
  const getDocumentByType = (type: string) => {
    return documents.find(doc => doc.type === type);
  };

  // Get hover requirement text
  const getRequirementText = (parent: string, requires: string) => {
    const dep = dependencies.find(d => d.parent === parent && d.requires === requires);
    if (dep) {
      return dep.reason;
    }
    
    // Default requirements
    const requirements: Record<string, string> = {
      'passport': 'Passport must be valid 6 months after visa expiry',
      'health_insurance': 'Health insurance must be active (not expired)',
      'ejari': 'Ejari must be valid for at least 3 months',
      'emirates_id': 'Emirates ID is linked to visa validity'
    };
    
    return requirements[requires] || 'Required for visa renewal';
  };

  return (
    <div className="w-full h-96 relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden">
      {/* Connection Lines */}
      {/* Passport to UAE Visa */}
      <div 
        className="absolute z-10"
        style={{
          top: '35%',
          left: '37.5%',
          width: '25%',
          height: '2px',
          ...getConnectionStyle(getDependencyStatus('uae_visa', 'passport'))
        }}
      />
      
      {/* Health Insurance to UAE Visa */}
      <div 
        className="absolute z-10"
        style={{
          top: '35%',
          left: '50%',
          width: '25%',
          height: '2px',
          ...getConnectionStyle(getDependencyStatus('uae_visa', 'health_insurance'))
        }}
      />
      
      {/* Ejari to UAE Visa */}
      <div 
        className="absolute z-10"
        style={{
          top: '65%',
          left: '37.5%',
          width: '25%',
          height: '2px',
          ...getConnectionStyle(getDependencyStatus('uae_visa', 'ejari'))
        }}
      />
      
      {/* Emirates ID to UAE Visa */}
      <div 
        className="absolute z-10"
        style={{
          top: '65%',
          left: '50%',
          width: '25%',
          height: '2px',
          ...getConnectionStyle(getDependencyStatus('uae_visa', 'emirates_id'))
        }}
      />

      {/* Document Nodes */}
      {Object.entries(nodePositions).map(([docType, position]) => {
        const doc = getDocumentByType(docType);
        if (!doc) return null;
        
        const status = getDocumentStatus(doc);
        const isHovered = hoveredNode === docType;
        const isCenter = docType === 'uae_visa';
        
        return (
          <div
            key={docType}
            className={`absolute z-20 cursor-pointer transition-all duration-300 ${
              isHovered ? 'scale-110' : 'hover:scale-105'
            }`}
            style={{
              top: position.top,
              left: position.left,
              transform: position.transform
            }}
            onMouseEnter={() => setHoveredNode(docType)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <div className={`
              ${isCenter ? 'w-32 h-24' : 'w-24 h-20'} 
              ${isCenter ? 'bg-blue-500' : 'bg-white'} 
              ${isCenter ? 'text-white' : 'text-gray-900'}
              rounded-lg shadow-lg border-2 border-gray-300
              flex flex-col items-center justify-center p-2
              ${isHovered ? 'shadow-xl border-blue-400' : ''}
            `}>
              {/* Document Icon */}
              <div className="text-2xl mb-1">
                {getDocumentEmoji(docType)}
              </div>
              
              {/* Document Type */}
              <div className={`text-xs font-semibold text-center ${isCenter ? 'text-white' : 'text-gray-800'}`}>
                {getDocumentTypeName(docType)}
              </div>
              
              {/* Expiry Date */}
              <div className={`text-xs text-center ${isCenter ? 'text-blue-100' : 'text-gray-600'}`}>
                {new Date(doc.expiryDate).toLocaleDateString()}
              </div>
              
              {/* Status Indicator */}
              <div className={`w-3 h-3 rounded-full mt-1 ${getStatusColor(status)}`} />
            </div>
            
            {/* Hover Tooltip */}
            {isHovered && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-30">
                <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 max-w-48 text-center shadow-lg">
                  <div className="font-semibold mb-1">
                    {getDocumentTypeName(docType)}
                  </div>
                  <div className="text-gray-300">
                    {getRequirementText('uae_visa', docType)}
                  </div>
                  <div className="text-yellow-300 mt-1">
                    Status: {status.toUpperCase()}
                  </div>
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
              </div>
            )}
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg border">
        <div className="text-xs font-semibold text-gray-700 mb-2">Connection Status:</div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-green-500"></div>
            <span className="text-xs text-gray-600">Valid</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-yellow-500 border-dashed border-t-2"></div>
            <span className="text-xs text-gray-600">Warning</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-red-500"></div>
            <span className="text-xs text-gray-600">Failing</span>
          </div>
        </div>
      </div>

      {/* Center Title */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
        <div className="bg-white rounded-lg px-4 py-2 shadow-lg border">
          <h3 className="text-sm font-bold text-gray-800">Document Dependency Graph</h3>
          <p className="text-xs text-gray-600">Hover over nodes to see requirements</p>
        </div>
      </div>
    </div>
  );
}
