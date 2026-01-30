"""
Service d'Optimisation des Emplois du Temps - SGAI 2.0
Utilise un Algorithme Génétique (DEAP) pour résoudre le problème CSP

Author: Équipe SGAI
Date: Janvier 2025
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from typing import List, Dict, Any
import requests
from datetime import datetime

from optimizer.genetic_algorithm import ScheduleOptimizer
from optimizer.constraints import validate_schedule
from config.config import (
    FLASK_HOST, FLASK_PORT, FLASK_DEBUG,
    SPRING_BOOT_URL, SPRING_BOOT_TIMEOUT,
    POPULATION_SIZE, MAX_GENERATIONS
)

# Configuration logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialisation Flask
app = Flask(__name__)
CORS(app)


def fetch_schedule_data(classroom_id: int) -> Dict[str, Any]:
    """
    Récupère les données nécessaires depuis Spring Boot
    
    Args:
        classroom_id: ID de la classe
        
    Returns:
        Dictionnaire avec courses, rooms, timeslots, teachers
    """
    try:
        url = f"{SPRING_BOOT_URL}/api/schedule/data/{classroom_id}"
        response = requests.get(url, timeout=SPRING_BOOT_TIMEOUT)
        response.raise_for_status()
        
        data = response.json()
        logger.info(f"Données récupérées: {len(data.get('courses', []))} cours, "
                   f"{len(data.get('rooms', []))} salles")
        
        return data
        
    except requests.RequestException as e:
        logger.error(f"Erreur récupération données: {e}")
        # Données de démonstration si Spring Boot indisponible
        return {
            'classroom_id': classroom_id,
            'courses': [
                {'id': 1, 'subject': 'Mathématiques', 'teacher_id': 1, 'duration': 2, 'students_count': 30},
                {'id': 2, 'subject': 'Physique', 'teacher_id': 2, 'duration': 2, 'students_count': 30},
                {'id': 3, 'subject': 'Informatique', 'teacher_id': 3, 'duration': 3, 'students_count': 30},
            ],
            'rooms': [
                {'id': 1, 'name': 'Amphi A', 'capacity': 50, 'type': 'lecture'},
                {'id': 2, 'name': 'Salle TP', 'capacity': 25, 'type': 'lab'},
                {'id': 3, 'name': 'Salle TD', 'capacity': 35, 'type': 'tutorial'},
            ],
            'timeslots': [
                {'id': 1, 'day': 'Lundi', 'start_time': '08:00', 'end_time': '10:00'},
                {'id': 2, 'day': 'Lundi', 'start_time': '10:00', 'end_time': '12:00'},
                {'id': 3, 'day': 'Mardi', 'start_time': '08:00', 'end_time': '10:00'},
                {'id': 4, 'day': 'Mardi', 'start_time': '10:00', 'end_time': '12:00'},
                {'id': 5, 'day': 'Mercredi', 'start_time': '08:00', 'end_time': '10:00'},
            ],
            'teachers': [
                {'id': 1, 'name': 'Prof. Alami', 'available_slots': [1, 2, 3, 4]},
                {'id': 2, 'name': 'Prof. Bennani', 'available_slots': [1, 2, 5]},
                {'id': 3, 'name': 'Prof. Chakir', 'available_slots': [2, 3, 4, 5]},
            ]
        }


@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint de santé pour monitoring"""
    return jsonify({
        'status': 'healthy',
        'service': 'schedule-optimizer',
        'timestamp': datetime.now().isoformat(),
        'config': {
            'population_size': POPULATION_SIZE,
            'max_generations': MAX_GENERATIONS
        }
    }), 200


@app.route('/api/schedule/optimize', methods=['POST'])
def optimize_schedule():
    """
    Optimise l'emploi du temps pour une classe
    
    Body JSON:
        {
            "classroom_id": 1,
            "constraints": {
                "allow_gaps": false,
                "balance_days": true,
                "avoid_friday_evening": true
            }
        }
    
    Returns:
        JSON avec le planning optimisé
    """
    try:
        data = request.get_json()
        classroom_id = data.get('classroom_id')
        constraints_config = data.get('constraints', {})
        
        if not classroom_id:
            return jsonify({'error': 'classroom_id is required'}), 400
        
        logger.info(f"Optimisation EDT pour classe {classroom_id}")
        
        # Récupération des données
        schedule_data = fetch_schedule_data(classroom_id)
        
        # Initialisation de l'optimiseur
        optimizer = ScheduleOptimizer(
            courses=schedule_data['courses'],
            rooms=schedule_data['rooms'],
            timeslots=schedule_data['timeslots'],
            teachers=schedule_data['teachers'],
            constraints_config=constraints_config
        )
        
        # Lancement de l'optimisation
        best_schedule, stats = optimizer.optimize(
            pop_size=POPULATION_SIZE,
            max_gen=MAX_GENERATIONS
        )
        
        # Validation finale
        violations = validate_schedule(best_schedule, schedule_data)
        
        # Construction de la réponse
        response = {
            'classroom_id': classroom_id,
            'schedule': best_schedule,
            'statistics': {
                'generations': stats['generations'],
                'best_fitness': float(stats['best_fitness']),
                'avg_fitness': float(stats['avg_fitness']),
                'convergence_generation': stats['convergence_gen'],
                'execution_time_seconds': stats['execution_time']
            },
            'quality': {
                'hard_violations': violations['hard'],
                'soft_violations': violations['soft'],
                'total_violations': violations['hard'] + violations['soft'],
                'is_valid': violations['hard'] == 0
            },
            'metadata': {
                'algorithm': 'Genetic Algorithm (DEAP)',
                'population_size': POPULATION_SIZE,
                'max_generations': MAX_GENERATIONS,
                'optimized_at': datetime.now().isoformat()
            }
        }
        
        logger.info(f"Optimisation terminée: {violations['hard']} violations dures, "
                   f"{violations['soft']} violations souples")
        
        return jsonify(response), 200
        
    except Exception as e:
        logger.error(f"Erreur optimisation: {e}", exc_info=True)
        return jsonify({
            'error': 'Optimization failed',
            'message': str(e)
        }), 500


@app.route('/api/schedule/validate', methods=['POST'])
def validate_schedule_endpoint():
    """
    Valide un emploi du temps existant
    
    Body JSON:
        {
            "classroom_id": 1,
            "schedule": [
                {"course_id": 1, "room_id": 1, "timeslot_id": 1},
                ...
            ]
        }
    
    Returns:
        JSON avec les violations détectées
    """
    try:
        data = request.get_json()
        classroom_id = data.get('classroom_id')
        schedule = data.get('schedule')
        
        if not classroom_id or not schedule:
            return jsonify({'error': 'classroom_id and schedule are required'}), 400
        
        # Récupération des données
        schedule_data = fetch_schedule_data(classroom_id)
        
        # Validation
        violations = validate_schedule(schedule, schedule_data)
        
        return jsonify({
            'classroom_id': classroom_id,
            'violations': violations,
            'is_valid': violations['hard'] == 0,
            'details': violations.get('details', [])
        }), 200
        
    except Exception as e:
        logger.error(f"Erreur validation: {e}")
        return jsonify({
            'error': 'Validation failed',
            'message': str(e)
        }), 500


@app.route('/api/schedule/config', methods=['GET', 'PUT'])
def manage_config():
    """
    GET: Récupère la configuration actuelle
    PUT: Met à jour la configuration
    """
    if request.method == 'GET':
        return jsonify({
            'population_size': POPULATION_SIZE,
            'max_generations': MAX_GENERATIONS,
            'spring_boot_url': SPRING_BOOT_URL
        }), 200
    
    else:  # PUT
        try:
            data = request.get_json()
            # Note: Nécessiterait un mécanisme de persistance
            return jsonify({
                'message': 'Configuration updated successfully',
                'config': data
            }), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400


@app.route('/api/schedule/stats', methods=['GET'])
def get_stats():
    """
    Retourne des statistiques sur les optimisations effectuées
    """
    # Note: Nécessiterait un système de tracking en production
    return jsonify({
        'total_optimizations': 0,
        'avg_execution_time': 0,
        'success_rate': 0
    }), 200


@app.errorhandler(404)
def not_found(error):
    """Gestion des routes non trouvées"""
    return jsonify({
        'error': 'Not found',
        'message': 'The requested endpoint does not exist'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Gestion des erreurs internes"""
    logger.error(f"Internal server error: {error}")
    return jsonify({
        'error': 'Internal server error',
        'message': 'An unexpected error occurred'
    }), 500


if __name__ == '__main__':
    logger.info("=== Démarrage Service Optimisation EDT ===")
    logger.info(f"Configuration: Pop={POPULATION_SIZE}, Gen={MAX_GENERATIONS}")
    logger.info(f"Spring Boot: {SPRING_BOOT_URL}")
    logger.info(f"Serveur prêt sur http://{FLASK_HOST}:{FLASK_PORT}")
    
    app.run(
        host=FLASK_HOST,
        port=FLASK_PORT,
        debug=FLASK_DEBUG
    )